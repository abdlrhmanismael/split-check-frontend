import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Plus, Sparkles } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 40px rgba(255, 215, 0, 0.3)",
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-12 h-12 text-yellow-500 mr-3" />
            <h1 className="text-6xl md:text-7xl font-serif font-bold luxury-text-gradient">
              Split Check
            </h1>
            <Sparkles className="w-12 h-12 text-yellow-500 ml-3" />
          </div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Elegantly split bills with friends. Track orders, calculate totals,
            and manage payments with luxury precision.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Card className="glassmorphism luxury-border hover:bg-white/5 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Plus className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white group-hover:text-yellow-400 transition-colors">
                    Create New Session
                  </h3>
                  <p className="text-gray-400 text-center">
                    Start a new bill splitting session and invite your friends
                    to join
                  </p>
                  <Button
                    variant="luxury"
                    size="xl"
                    className="w-full mt-4"
                    onClick={() => navigate("/create")}
                  >
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Card className="glassmorphism luxury-border hover:bg-white/5 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                    Join Session
                  </h3>
                  <p className="text-gray-400 text-center">
                    Join an existing session and add your orders to the bill
                  </p>
                  <Button
                    variant="glass"
                    size="xl"
                    className="w-full mt-4"
                    onClick={() => navigate("/join")}
                  >
                    Join Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-12 text-gray-500 text-sm"
        >
          <p>Experience luxury bill splitting with precision and elegance</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Landing;
