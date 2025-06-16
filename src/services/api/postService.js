import postsData from '../mockData/posts.json';
import userService from './userService.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PostService {
  constructor() {
    this.posts = [...postsData];
  }

  async getAll() {
    await delay(400);
    const posts = [...this.posts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Enrich posts with author data
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        try {
          const author = await userService.getById(post.authorId);
          return { ...post, author };
        } catch (error) {
          return { ...post, author: null };
        }
      })
    );
    
    return enrichedPosts;
  }

  async getById(id) {
    await delay(200);
    const post = this.posts.find(post => post.Id === parseInt(id, 10));
    if (!post) {
      throw new Error('Post not found');
    }
    
    try {
      const author = await userService.getById(post.authorId);
      return { ...post, author };
    } catch (error) {
      return { ...post, author: null };
    }
  }

  async getByUserId(userId) {
    await delay(300);
    const userPosts = this.posts
      .filter(post => post.authorId === parseInt(userId, 10))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return userPosts.map(post => ({ ...post }));
  }

  async create(postData) {
    await delay(500);
    const currentUser = await userService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const highestId = Math.max(...this.posts.map(post => post.Id));
    const newPost = {
      Id: highestId + 1,
      authorId: currentUser.Id,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: new Date().toISOString(),
      hashtags: this.extractHashtags(postData.content || ''),
      liked: false,
      bookmarked: false,
      media: postData.media || [],
      ...postData
    };
    
    this.posts.unshift(newPost);
    
    // Update user post count
    currentUser.postsCount += 1;
    
    return { ...newPost, author: currentUser };
  }

  async update(id, postData) {
    await delay(350);
    const index = this.posts.findIndex(post => post.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Post not found');
    }
    
    const updatedPost = { 
      ...this.posts[index], 
      ...postData,
      hashtags: this.extractHashtags(postData.content || this.posts[index].content)
    };
    delete updatedPost.Id; // Prevent Id modification
    this.posts[index] = { ...this.posts[index], ...updatedPost };
    
    try {
      const author = await userService.getById(this.posts[index].authorId);
      return { ...this.posts[index], author };
    } catch (error) {
      return { ...this.posts[index], author: null };
    }
  }

  async delete(id) {
    await delay(300);
    const index = this.posts.findIndex(post => post.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Post not found');
    }
    
    const deletedPost = this.posts.splice(index, 1)[0];
    return { ...deletedPost };
  }

  async likePost(id) {
    await delay(200);
    const post = this.posts.find(post => post.Id === parseInt(id, 10));
    if (!post) {
      throw new Error('Post not found');
    }
    
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    post.likes = Math.max(0, post.likes);
    
    return { ...post };
  }

  async bookmarkPost(id) {
    await delay(200);
    const post = this.posts.find(post => post.Id === parseInt(id, 10));
    if (!post) {
      throw new Error('Post not found');
    }
    
    post.bookmarked = !post.bookmarked;
    return { ...post };
  }

  async sharePost(id) {
    await delay(250);
    const post = this.posts.find(post => post.Id === parseInt(id, 10));
    if (!post) {
      throw new Error('Post not found');
    }
    
    post.shares += 1;
    return { ...post };
  }

  async searchPosts(query) {
    await delay(300);
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return this.posts
      .filter(post => 
        post.content.toLowerCase().includes(searchTerm) ||
        post.hashtags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        (post.location && post.location.toLowerCase().includes(searchTerm))
      )
      .slice(0, 10)
      .map(post => ({ ...post }));
  }

  async getTrendingHashtags() {
    await delay(200);
    const hashtagCounts = {};
    
    this.posts.forEach(post => {
      post.hashtags.forEach(tag => {
        hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
      });
    });
    
    return Object.entries(hashtagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));
  }

  extractHashtags(content) {
    const hashtagRegex = /#[\w]+/g;
    const matches = content.match(hashtagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
  }
}

export default new PostService();