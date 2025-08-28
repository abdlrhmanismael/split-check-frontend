import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Users } from "lucide-react";

const JoinPage = () => {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionId.trim()) {
      navigate(`/join/${sessionId.trim()}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="mr-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center">
            <Sparkles className="w-6 h-6 text-yellow-500 mr-2" />
            <h1 className="text-3xl font-serif font-bold luxury-text-gradient">
              Join Session
            </h1>
          </div>
        </div>

        <Card className="glassmorphism luxury-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-2xl luxury-text-gradient">
              Enter Session ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sessionId">Session ID</Label>
                <Input
                  id="sessionId"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="Enter the session ID"
                  required
                  className="text-center text-lg"
                />
              </div>
              <Button
                type="submit"
                variant="luxury"
                size="xl"
                className="w-full"
                disabled={!sessionId.trim()}
              >
                Join Session
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default JoinPage;
