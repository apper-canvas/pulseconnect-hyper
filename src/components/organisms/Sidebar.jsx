import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import TrendingHashtag from "@/components/molecules/TrendingHashtag";
import ApperIcon from "@/components/ApperIcon";
import { postService, userService } from "@/services";

const Sidebar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [trendingHashtags, setTrendingHashtags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSidebarData = async () => {
      try {
        const [user, hashtags] = await Promise.all([
          userService.getCurrentUser(),
          postService.getTrendingHashtags()
        ]);
        
        setCurrentUser(user);
        setTrendingHashtags(hashtags);
      } catch (error) {
        console.error('Failed to load sidebar data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSidebarData();
  }, []);

  if (loading) {
    return (
      <div className="w-280 bg-surface-50 border-r border-surface-200 p-4 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-surface-200 rounded-lg"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-surface-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

return (
    <aside
    className="hidden lg:block w-280 bg-surface-50 border-r border-surface-200 overflow-y-auto min-h-screen">
    <div className="p-4 space-y-6">
        {/* User Stats Card */}
        {currentUser && <motion.div
            initial={{
                opacity: 0,
                y: 20
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            className="bg-white rounded-xl p-6 shadow-sm border border-surface-200">
            <div className="flex items-center space-x-4 mb-4">
                <Avatar src={currentUser.avatar} alt={currentUser.displayName} size="large" />
                <div>
                    <h3 className="font-semibold text-surface-900">
                        {currentUser.displayName}
                    </h3>
                    <p className="text-surface-500 text-sm">@{currentUser.username}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-xl font-bold text-surface-900">
                        {currentUser.postsCount}
                    </p>
                    <p className="text-xs text-surface-500 font-medium">Posts</p>
                </div>
                <div>
                    <p className="text-xl font-bold text-surface-900">
                        {currentUser.followers}
                    </p>
                    <p className="text-xs text-surface-500 font-medium">Followers</p>
                </div>
                <div>
                    <p className="text-xl font-bold text-surface-900">
                        {currentUser.following}
                    </p>
                    <p className="text-xs text-surface-500 font-medium">Following</p>
                </div>
            </div>
        </motion.div>}
        {/* Trending Hashtags */}
        <motion.div
            initial={{
                opacity: 0,
                y: 20
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            transition={{
                delay: 0.1
            }}
            className="bg-white rounded-xl p-6 shadow-sm border border-surface-200">
            <div className="flex items-center space-x-2 mb-4">
                <ApperIcon name="TrendingUp" size={20} className="text-primary" />
                <h3 className="font-semibold text-surface-900">Trending</h3>
            </div>
            <div className="space-y-1">
                {trendingHashtags.slice(0, 6).map((item, index) => <TrendingHashtag
                    key={item.tag}
                    tag={item.tag}
                    count={item.count}
                    trend={index < 3 ? "up" : index < 5 ? "down" : null}
                    onClick={() => console.log(`Clicked on #${item.tag}`)} />)}
            </div>
            <button
                className="w-full mt-4 text-sm text-primary hover:text-accent font-medium transition-colors">Show more
                          </button>
        </motion.div>
</div>
</aside>
  );
};

export default Sidebar;