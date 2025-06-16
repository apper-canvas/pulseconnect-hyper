import usersData from '../mockData/users.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  constructor() {
    this.users = [...usersData];
  }

  async getAll() {
    await delay(300);
    return [...this.users];
  }

  async getById(id) {
    await delay(200);
    const user = this.users.find(user => user.Id === parseInt(id, 10));
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  }

  async getCurrentUser() {
    await delay(200);
    const currentUser = this.users.find(user => user.username === 'current_user');
    return currentUser ? { ...currentUser } : null;
  }

  async searchUsers(query) {
    await delay(250);
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return this.users
      .filter(user => 
        user.username.toLowerCase().includes(searchTerm) ||
        user.displayName.toLowerCase().includes(searchTerm)
      )
      .slice(0, 5)
      .map(user => ({ ...user }));
  }

  async create(userData) {
    await delay(400);
    const highestId = Math.max(...this.users.map(user => user.Id));
    const newUser = {
      Id: highestId + 1,
      followers: 0,
      following: 0,
      postsCount: 0,
      verified: false,
      ...userData
    };
    this.users.push(newUser);
    return { ...newUser };
  }

  async update(id, userData) {
    await delay(350);
    const index = this.users.findIndex(user => user.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('User not found');
    }
    
    const updatedUser = { ...this.users[index], ...userData };
    delete updatedUser.Id; // Prevent Id modification
    this.users[index] = { ...this.users[index], ...updatedUser };
    return { ...this.users[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.users.findIndex(user => user.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('User not found');
    }
    
    const deletedUser = this.users.splice(index, 1)[0];
    return { ...deletedUser };
  }

  async followUser(userId) {
    await delay(300);
    const currentUser = await this.getCurrentUser();
    const targetUser = await this.getById(userId);
    
    // Simulate follow action
    targetUser.followers += 1;
    currentUser.following += 1;
    
    return { success: true };
  }

  async unfollowUser(userId) {
    await delay(300);
    const currentUser = await this.getCurrentUser();
    const targetUser = await this.getById(userId);
    
    // Simulate unfollow action
    targetUser.followers = Math.max(0, targetUser.followers - 1);
    currentUser.following = Math.max(0, currentUser.following - 1);
    
    return { success: true };
  }
}

export default new UserService();