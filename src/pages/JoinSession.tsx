import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { getSessionSummary, joinSession } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Receipt,
  Sparkles,
  CreditCard,
  DollarSign,
} from "lucide-react";
import type { Session, Product } from "@/types";

const JoinSession = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [name, setName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<boolean>(false); // false = Cash, true = InstaPay
  const [products, setProducts] = useState<Omit<Product, "id">[]>([
    { productName: "", unitPrice: 0, quantity: 1 },
  ]);

  useEffect(() => {
    if (sessionId) {
      loadSession();
    }
  }, [sessionId]);

  const loadSession = async () => {
    try {
      const response = await getSessionSummary(sessionId!);
      // Create a session object from the summary data
      const sessionData: Session = {
        sessionId: response.summary.sessionId,
        totalOrderAmount: response.summary.totalOrderAmount,
        billImage: response.summary.billImage,
        createdAt: new Date().toISOString(), // We don't have this in summary
        friends: response.summary.friends,
      };
      setSession(sessionData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load session. Please check the link.",
        variant: "destructive",
      });
      navigate("/");
    }
  };

  const addProduct = () => {
    setProducts([...products, { productName: "", unitPrice: 0, quantity: 1 }]);
  };

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      setProducts(products.filter((_, i) => i !== index));
    }
  };

  const updateProduct = (
    index: number,
    field: keyof Omit<Product, "id">,
    value: string | number
  ) => {
    const updatedProducts = [...products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]:
        field === "quantity" || field === "unitPrice" ? Number(value) : value,
    };
    setProducts(updatedProducts);
  };

  // Removed calculateTotal function as backend handles all calculations including taxes, services, and delivery

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    const validProducts = products.filter(
      (p) => p.productName.trim() && p.unitPrice > 0
    );
    if (validProducts.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one product.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await joinSession(sessionId!, {
        name: name.trim(),
        products: validProducts,
        paymentMethod,
      });

      toast({
        title: "Success!",
        description: "You have successfully joined the session.",
        variant: "success",
      });

      navigate(`/summary/${sessionId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  const productVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2,
        ease: "easeIn" as const,
      },
    },
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
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
                Join Session
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bill Preview */}
            <Card className="glassmorphism luxury-border">
              <CardHeader>
                <CardTitle className="text-xl luxury-text-gradient flex items-center">
                  <Receipt className="w-5 h-5 mr-2" />
                  Bill Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {session.billImage && (
                  <div
                    className="aspect-video bg-gray-800 rounded-lg overflow-hidden group cursor-pointer relative"
                    onClick={() => window.open(session.billImage, "_blank")}
                  >
                    <img
                      src={session.billImage}
                      alt="Bill"
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm">
                        Click to view full size
                      </div>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Amount:</span>
                    <span className="font-semibold text-white">
                      {formatCurrency(session.totalOrderAmount)}
                    </span>
                  </div>
                  {session.taxPercentage && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Tax ({session.taxPercentage}%):
                      </span>
                      <span className="text-gray-300">
                        {formatCurrency(
                          session.totalOrderAmount *
                            (session.taxPercentage / 100)
                        )}
                      </span>
                    </div>
                  )}
                  {session.servicePercentage && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Service ({session.servicePercentage}%):
                      </span>
                      <span className="text-gray-300">
                        {formatCurrency(
                          session.totalOrderAmount *
                            (session.servicePercentage / 100)
                        )}
                      </span>
                    </div>
                  )}
                  {session.deliveryFee && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Delivery Fee:</span>
                      <span className="text-gray-300">
                        {formatCurrency(session.deliveryFee)}
                      </span>
                    </div>
                  )}
                  {session.instaPayURL && (
                    <div className="pt-2 border-t border-gray-700">
                      <a
                        href={session.instaPayURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-500 hover:text-yellow-400 text-sm flex items-center"
                      >
                        <CreditCard className="w-4 h-4 mr-1" />
                        InstaPay Link
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Join Form */}
            <Card className="glassmorphism luxury-border">
              <CardHeader>
                <CardTitle className="text-xl luxury-text-gradient">
                  Your Order
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base">Payment Method</Label>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <Switch
                          checked={paymentMethod}
                          onCheckedChange={setPaymentMethod}
                        />
                        <CreditCard className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      {paymentMethod ? "InstaPay" : "Cash"} Payment
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base">Products</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addProduct}
                        className="luxury-border"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Product
                      </Button>
                    </div>

                    <AnimatePresence>
                      {products.map((product, index) => (
                        <motion.div
                          key={index}
                          variants={productVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="grid grid-cols-11 gap-2 items-end"
                        >
                          <div className="col-span-5">
                            <Label className="text-xs text-gray-400">
                              Product
                            </Label>
                            <Input
                              value={product.productName}
                              onChange={(e) =>
                                updateProduct(
                                  index,
                                  "productName",
                                  e.target.value
                                )
                              }
                              placeholder="Product name"
                            />
                          </div>
                          <div className="col-span-3">
                            <Label className="text-xs text-gray-400">
                              Price
                            </Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={product.unitPrice || ""}
                              onChange={(e) =>
                                updateProduct(
                                  index,
                                  "unitPrice",
                                  e.target.value
                                )
                              }
                              placeholder="0.00"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs text-gray-400">Qty</Label>
                            <Input
                              type="number"
                              min="1"
                              value={product.quantity || ""}
                              onChange={(e) =>
                                updateProduct(index, "quantity", e.target.value)
                              }
                              placeholder="1"
                            />
                          </div>

                          <div className="col-span-1">
                            {products.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeProduct(index)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    <div className="pt-4 border-t border-gray-700">
                      <div className="text-center">
                        <p className="text-sm text-gray-400">
                          Final total will be calculated by the server including
                          taxes, services, and delivery fees
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="luxury"
                    size="xl"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Joining Session..." : "Join Session"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinSession;
