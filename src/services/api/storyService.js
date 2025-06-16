import storiesData from '../mockData/stories.json';
import userService from './userService.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class StoryService {
  constructor() {
    this.stories = [...storiesData];
  }

  async getAll() {
    await delay(300);
    const stories = [...this.stories].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Enrich stories with user data
    const enrichedStories = await Promise.all(
      stories.map(async (story) => {
        try {
          const user = await userService.getById(story.userId);
          return { ...story, user };
        } catch (error) {
          return { ...story, user: null };
        }
      })
    );
    
    return enrichedStories;
  }

  async getById(id) {
    await delay(200);
    const story = this.stories.find(story => story.Id === parseInt(id, 10));
    if (!story) {
      throw new Error('Story not found');
    }
    
    try {
      const user = await userService.getById(story.userId);
      return { ...story, user };
    } catch (error) {
      return { ...story, user: null };
    }
  }

  async getByUserId(userId) {
    await delay(250);
    const userStories = this.stories
      .filter(story => story.userId === parseInt(userId, 10))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return userStories.map(story => ({ ...story }));
  }

  async create(storyData) {
    await delay(400);
    const currentUser = await userService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const highestId = Math.max(...this.stories.map(story => story.Id));
    const newStory = {
      Id: highestId + 1,
      userId: currentUser.Id,
      timestamp: new Date().toISOString(),
      viewed: false,
      type: 'image',
      ...storyData
    };
    
    this.stories.unshift(newStory);
    return { ...newStory, user: currentUser };
  }

  async update(id, storyData) {
    await delay(300);
    const index = this.stories.findIndex(story => story.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Story not found');
    }
    
    const updatedStory = { ...this.stories[index], ...storyData };
    delete updatedStory.Id; // Prevent Id modification
    this.stories[index] = { ...this.stories[index], ...updatedStory };
    
    try {
      const user = await userService.getById(this.stories[index].userId);
      return { ...this.stories[index], user };
    } catch (error) {
      return { ...this.stories[index], user: null };
    }
  }

  async delete(id) {
    await delay(250);
    const index = this.stories.findIndex(story => story.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Story not found');
    }
    
    const deletedStory = this.stories.splice(index, 1)[0];
    return { ...deletedStory };
  }

  async markAsViewed(id) {
    await delay(100);
    const story = this.stories.find(story => story.Id === parseInt(id, 10));
    if (!story) {
      throw new Error('Story not found');
    }
    
    story.viewed = true;
    return { ...story };
  }
}

export default new StoryService();