import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { MessageCircle, Send, X } from "lucide-react"
import { ScrollArea } from './ui/scroll-area'

export function ChatBar() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today? ✨", sender: "assistant" },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (message.trim() && !isLoading) {
      setIsLoading(true)

      // Add user message
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: "user"
      }

      const updatedMessages = [...messages, newMessage]
      setMessages(updatedMessages)

      const currentMessage = message
      setMessage('')

      try {
        // Get last 20 messages for context
        const last20Messages = updatedMessages.slice(-20).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }))

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: last20Messages
          })
        })

        if (!response.ok) {
          throw new Error('Failed to get response')
        }

        const data = await response.json()

        // Add assistant response
        const assistantResponse = {
          id: updatedMessages.length + 1,
          text: data.message || "Sorry, I couldn't process your request.",
          sender: "assistant"
        }

        setMessages(prev => [...prev, assistantResponse])
      } catch (error) {
        console.error('Error getting AI response:', error)

        // Add error message
        const errorResponse = {
          id: updatedMessages.length + 1,
          text: "Sorry, I'm having trouble connecting right now. Please try again.",
          sender: "assistant"
        }

        setMessages(prev => [...prev, errorResponse])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-lg">
          <MessageCircle size={16} />
          Ask anything
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full bg-background/20 backdrop-blur-3xl border-l border-white/10 shadow-2xl">

        <SheetHeader className="flex-shrink-0 bg-white/5 backdrop-blur-sm border-b border-white/10">
          <SheetTitle className="text-white font-medium text-lg">Mars Assistant</SheetTitle>
          <SheetDescription className="text-white/70 text-sm">
            Ask me anything about the Perseverance Rover and its findings.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className='flex-1 min-h-0'>
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0 scrollbar-hide">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 backdrop-blur-md transition-all duration-200 ${msg.sender === 'user'
                    ? 'bg-blue-500/80 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-white/10 text-white border border-white/20 shadow-lg'
                    }`}
                >
                  <div className="text-sm leading-relaxed space-y-3">
                    {msg.text.split('\n\n').map((para, i) => (
                      <p key={i}>
                        {para.split(/(\*\*.*?\*\*)/).map((part, j) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <span key={j} className="font-bold">{part.slice(2, -2)}</span>;
                          }
                          return part;
                        })}
                      </p>
                    ))}
                  </div>

                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 backdrop-blur-md bg-white/10 text-white border border-white/20 shadow-lg">
                  <p className="text-sm leading-relaxed">Thinking...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Chat Input Area */}
        <SheetFooter className="flex-shrink-0 p-4 bg-white/5 backdrop-blur-sm border-t border-white/10">
          <div className="flex w-full gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 rounded-2xl px-4 py-3 focus:bg-white/15 focus:border-white/30 transition-all duration-200 shadow-lg disabled:opacity-50"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              size="sm"
              disabled={isLoading || !message.trim()}
              className="bg-blue-500/80 hover:bg-blue-500 text-white border-0 rounded-2xl px-4 py-3 backdrop-blur-md shadow-lg shadow-blue-500/20 transition-all duration-200 disabled:opacity-50"
            >
              <Send size={16} />
            </Button>
          </div>
          <SheetClose asChild>
            <Button className="mt-3 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/20 rounded-2xl backdrop-blur-md transition-all duration-200 shadow-lg">
              <X size={16} className="mr-2" />
              Close Chat
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}