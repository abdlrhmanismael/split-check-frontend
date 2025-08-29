import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createSession } from "@/lib/api";
import { generateSessionLink, copyToClipboard } from "@/lib/utils";
import { ArrowLeft, Upload, Copy, Check, Sparkles } from "lucide-react";
import type { CreateSessionRequest } from "@/types";

const CreateSession = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [sessionLink, setSessionLink] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateSessionRequest>({
    totalAmount: 0,
    taxPercentage: undefined,
    servicePercentage: undefined,
    deliveryFee: undefined,
    numberOfFriends: undefined,
    instaPayUrl: "",
    billImage: undefined,
  });

  const handleInputChange = (
    field: keyof CreateSessionRequest,
    value: string | number | File | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleInputChange("billImage", file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.numberOfFriends || formData.numberOfFriends < 1) {
      toast({
        title: "Error",
        description: "Please enter the number of friends",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await createSession(formData);
      setSessionLink(
        response.session.sessionLink ||
          generateSessionLink(response.session.sessionId)
      );
      setSessionId(response.session.sessionId);

      toast({
        title: "Session Created!",
        description:
          "Your bill splitting session has been created successfully.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await copyToClipboard(sessionLink);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Session link has been copied to clipboard.",
        variant: "success",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
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

  if (sessionLink) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <motion.div
          className="max-w-md w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="glassmorphism luxury-border">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl luxury-text-gradient">
                Session Created!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm text-gray-400">
                  Share this link with your friends:
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={sessionLink}
                    readOnly
                    className="bg-gray-800/50 border-gray-700"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyLink}
                    className="luxury-border"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="luxury"
                  className="flex-1"
                  onClick={() => navigate(`/summary/${sessionId}`)}
                >
                  View Session
                </Button>
                <Button
                  variant="glass"
                  className="flex-1"
                  onClick={() => {
                    setSessionLink("");
                    setSessionId("");
                    setFormData({
                      totalAmount: 0,
                      taxPercentage: undefined,
                      servicePercentage: undefined,
                      deliveryFee: undefined,
                      numberOfFriends: undefined,
                      instaPayUrl: "",
                      billImage: undefined,
                    });
                  }}
                >
                  Create Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
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
                Create Session
              </h1>
            </div>
          </div>

          <Card className="glassmorphism luxury-border">
            <CardHeader>
              <CardTitle className="text-2xl luxury-text-gradient">
                Session Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="totalAmount">Total Order Amount *</Label>
                    <Input
                      id="totalAmount"
                      type="number"
                      step="0.01"
                      required
                      value={formData.totalAmount || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "totalAmount",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="0.00"
                      className="text-lg font-semibold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numberOfFriends">
                      Number of Friends *
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="numberOfFriends"
                      type="number"
                      min="1"
                      required
                      value={formData.numberOfFriends || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "numberOfFriends",
                          parseInt(e.target.value) || undefined
                        )
                      }
                      placeholder="Enter number of friends"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxPercentage">Tax Percentage (%)</Label>
                    <Input
                      id="taxPercentage"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.taxPercentage || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "taxPercentage",
                          parseFloat(e.target.value) || undefined
                        )
                      }
                      placeholder="Optional"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="servicePercentage">
                      Service Percentage (%)
                    </Label>
                    <Input
                      id="servicePercentage"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.servicePercentage || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "servicePercentage",
                          parseFloat(e.target.value) || undefined
                        )
                      }
                      placeholder="Optional"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryFee">Delivery Fee</Label>
                    <Input
                      id="deliveryFee"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.deliveryFee || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "deliveryFee",
                          parseFloat(e.target.value) || undefined
                        )
                      }
                      placeholder="Optional"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instaPayUrl">InstaPay URL</Label>
                    <Input
                      id="instaPayUrl"
                      type="url"
                      value={formData.instaPayUrl}
                      onChange={(e) =>
                        handleInputChange("instaPayUrl", e.target.value)
                      }
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billImage">Upload Bill Image</Label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-yellow-500/50 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <Input
                      id="billImage"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("billImage")?.click()
                      }
                      className="luxury-border"
                    >
                      Choose File
                    </Button>
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-4">
                      <Label className="text-sm text-gray-400 mb-2 block">
                        Preview:
                      </Label>
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Bill preview"
                          className="w-full max-h-48 object-cover rounded-lg border border-gray-600"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="luxury"
                  size="xl"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Session..." : "Create Session"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateSession;
