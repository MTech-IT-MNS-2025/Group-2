import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route'; // Import your auth config
import dbConnect from '@/lib/db.cjs';
import Message from '@/models/Message.cjs';
import User from '@/models/User.cjs';
import { Types } from 'mongoose';

export async function GET(request) {
  // 1. Check if user is authenticated
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }

  // 2. Get the authenticated user's username
  const authenticatedUsername = session.user.username;
  const authenticatedUserId = session.user.id;

  // 3. Get query parameters
  const { searchParams } = new URL(request.url);
  const user1 = searchParams.get('user1'); // Should be the logged-in user
  const user2 = searchParams.get('user2'); // The person they are chatting with

  // 4. Security Check: Ensure the logged-in user is part of the query
  if (authenticatedUsername !== user1) {
    return NextResponse.json(
      { message: 'Forbidden: You can only fetch your own messages.' }, 
      { status: 403 }
    );
  }
  
  await dbConnect();

  try {
    // 5. Find the ObjectId of the other user
    const otherUser = await User.findOne({ username: user2 }).select('_id');
    if (!otherUser) {
      return NextResponse.json({ message: 'Recipient not found' }, { status: 404 });
    }
    
    const otherUserId = otherUser._id;
    const authUserId = new Types.ObjectId(authenticatedUserId);

    // 6. Find all messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: authUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: authUserId },
      ],
    })
    .sort({ timestamp: 1 }) // Show oldest first
    .populate('sender', 'username') // Populate sender info
    .populate('receiver', 'username'); // Populate receiver info

    // 7. Format data for the client
    const history = messages.map(msg => ({
      sender: msg.sender.username, // Send usernames, not ObjectIds
      receiver: msg.receiver.username,
      text: msg.text,
      timestamp: msg.timestamp,
    }));

    return NextResponse.json(history);

  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching messages', error: error.message },
      { status: 500 }
    );
  }
}