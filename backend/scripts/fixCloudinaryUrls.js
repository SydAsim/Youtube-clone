import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const fixCloudinaryUrls = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;

        // Fix videos collection - videoFile field
        const videosVideoFileResult = await db.collection('videos').updateMany(
            { videoFile: { $regex: '^http://' } },
            [
                {
                    $set: {
                        videoFile: {
                            $replaceOne: { input: "$videoFile", find: "http://", replacement: "https://" }
                        }
                    }
                }
            ]
        );
        console.log(`✅ Updated ${videosVideoFileResult.modifiedCount} video URLs in videos collection`);

        // Fix videos collection - thumbnail field
        const videosThumbnailResult = await db.collection('videos').updateMany(
            { thumbnail: { $regex: '^http://' } },
            [
                {
                    $set: {
                        thumbnail: {
                            $replaceOne: { input: "$thumbnail", find: "http://", replacement: "https://" }
                        }
                    }
                }
            ]
        );
        console.log(`✅ Updated ${videosThumbnailResult.modifiedCount} thumbnail URLs in videos collection`);

        // Fix users collection - avatar field
        const usersAvatarResult = await db.collection('users').updateMany(
            { avatar: { $regex: '^http://' } },
            [
                {
                    $set: {
                        avatar: {
                            $replaceOne: { input: "$avatar", find: "http://", replacement: "https://" }
                        }
                    }
                }
            ]
        );
        console.log(`✅ Updated ${usersAvatarResult.modifiedCount} avatar URLs in users collection`);

        // Fix users collection - coverImage field
        const usersCoverImageResult = await db.collection('users').updateMany(
            { coverImage: { $regex: '^http://' } },
            [
                {
                    $set: {
                        coverImage: {
                            $replaceOne: { input: "$coverImage", find: "http://", replacement: "https://" }
                        }
                    }
                }
            ]
        );
        console.log(`✅ Updated ${usersCoverImageResult.modifiedCount} coverImage URLs in users collection`);

        console.log('\n🎉 All Cloudinary URLs have been updated to HTTPS!');
        console.log('You can now redeploy your backend and the mixed content warnings will be gone.');

    } catch (error) {
        console.error('❌ Error updating URLs:', error);
    } finally {
        await mongoose.connection.close();
        console.log('✅ Database connection closed');
    }
};

fixCloudinaryUrls();
