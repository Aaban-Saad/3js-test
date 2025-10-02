import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // System prompt for Mars/Perseverance context
    const systemPrompt = `You are a helpful AI assistant specialized in NASA's Mars Perseverance Rover mission. You have extensive knowledge about:
    - The Perseverance Rover's instruments and capabilities
    - Mars geology, climate, and surface features
    - Scientific discoveries made by Perseverance
    - The Ingenuity helicopter companion
    - Mars sample collection and future return missions
    - Mars exploration history and future plans
    
    Provide accurate, informative responses while being engaging and accessible. If asked about topics outside Mars exploration, politely redirect the conversation back to Mars and space exploration topics.`

    // Convert messages to Gemini format
    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))

    // Get the latest user message
    const latestMessage = messages[messages.length - 1]

    // Start chat with history
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I\'m ready to help with questions about Mars, the Perseverance Rover, and space exploration!' }]
        },
        ...history
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      }
    })

    const result = await chat.sendMessage(latestMessage.content)
    const response = result.response
    const text = response.text()

    return NextResponse.json({ message: text })

  } catch (error) {
    console.error('Gemini API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate response',
        message: 'Sorry, I\'m having trouble processing your request right now. Please try again in a moment.'
      },
      { status: 500 }
    )
  }
}