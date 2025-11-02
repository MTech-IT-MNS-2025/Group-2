import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db.cjs';
import User from '@/models/User.cjs';

export async function POST(request) {
  await dbConnect();
  
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required.' }, 
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Username already exists.' }, 
        { status: 409 }
      );
    }

    const user = await User.create({ username, password });
    
    // Don't send the password back
    return NextResponse.json(
      { message: 'User created successfully', userId: user._id }, 
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred', error: error.message }, 
      { status: 500 }
    );
  }
}