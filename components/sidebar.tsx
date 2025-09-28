// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Sheet,
//   SheetClose,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet"
// import { MessageCircle } from "lucide-react"

// export function SheetDemo() {
//   return (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button variant="outline"><MessageCircle /> Ask anything</Button>
//       </SheetTrigger>
//       <SheetContent>
//         <SheetHeader>
//           <SheetTitle>Edit profile</SheetTitle>
//           <SheetDescription>
//             Make changes to your profile here. Click save when you&apos;re done.
//           </SheetDescription>
//         </SheetHeader>
//         <div className="grid flex-1 auto-rows-min gap-6 px-4">
//           <div className="grid gap-3">
//             <Label htmlFor="sheet-demo-name">Name</Label>
//             <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
//           </div>
//           <div className="grid gap-3">
//             <Label htmlFor="sheet-demo-username">Username</Label>
//             <Input id="sheet-demo-username" defaultValue="@peduarte" />
//           </div>
//         </div>
//         <SheetFooter>
//           <Button type="submit">Save changes</Button>
//           <SheetClose asChild>
//             <Button variant="outline">Close</Button>
//           </SheetClose>
//         </SheetFooter>
//       </SheetContent>
//     </Sheet>
//   )
// }



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

export function ChatBar() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today? ✨", sender: "assistant" },
  ])

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add user message
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: "user"
      }
      
      setMessages(prev => [...prev, newMessage])
      
      // Simulate assistant response
      setTimeout(() => {
        const assistantResponse = {
          id: messages.length + 2,
          text: "Thanks for your message! This is a demo response with glass theme. ✨",
          sender: "assistant"
        }
        setMessages(prev => [...prev, assistantResponse])
      }, 1000)
      
      setMessage('')
    }
  }

  const handleKeyPress = (e:any) => {
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
      <SheetContent className=" flex flex-col h-full bg-background/20 backdrop-blur-3xl border-l border-white/10 shadow-2xl">
        <SheetHeader className="flex-shrink-0 bg-white/5 backdrop-blur-sm border-b border-white/10">
          <SheetTitle className="text-white font-medium text-lg">Mars Assistant</SheetTitle>
          <SheetDescription className="text-white/70 text-sm">
            Ask me anything about the Perseverance Rover and its findings.
          </SheetDescription>
        </SheetHeader>
        
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0 scrollbar-hide">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 backdrop-blur-md transition-all duration-200 ${
                  msg.sender === 'user'
                    ? 'bg-blue-500/80 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-white/10 text-white border border-white/20 shadow-lg'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input Area */}
        <SheetFooter className="flex-shrink-0 p-4 bg-white/5 backdrop-blur-sm border-t border-white/10">
          <div className="flex w-full gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 rounded-2xl px-4 py-3 focus:bg-white/15 focus:border-white/30 transition-all duration-200 shadow-lg"
              />
            </div>
            <Button 
              onClick={handleSendMessage} 
              size="sm" 
              className="bg-blue-500/80 hover:bg-blue-500 text-white border-0 rounded-2xl px-4 py-3 backdrop-blur-md shadow-lg shadow-blue-500/20 transition-all duration-200"
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