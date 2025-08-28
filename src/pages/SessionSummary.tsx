import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  getSessionSummary,
  updateFriendPayment,
  deleteSession,
} from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Sparkles,
  Users,
  CreditCard,
  DollarSign,
  CheckCircle,
  XCircle,
  Trash2,
  Receipt,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import type { SessionSummary as SessionSummaryType } from "@/types";

const SessionSummary = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { toast } = useToast();
  const [summary, setSummary] = useState<SessionSummaryType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingPayments, setUpdatingPayments] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (sessionId) {
      loadSummary();
    }
  }, [sessionId]);

  const loadSummary = async () => {
    try {
      const response = await getSessionSummary(sessionId!);
      setSummary(response.summary);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load session summary.",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentToggle = async (friendId: string, hasPaid: boolean) => {
    setUpdatingPayments((prev) => new Set(prev).add(friendId));
    try {
      await updateFriendPayment(sessionId!, friendId, { hasPaid });
      await loadSummary(); // Reload to get updated data
      toast({
        title: "Payment Updated",
        description: `Payment status updated successfully.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment status.",
        variant: "destructive",
      });
    } finally {
      setUpdatingPayments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(friendId);
        return newSet;
      });
    }
  };

  const handleDeleteSession = async () => {
    try {
      await deleteSession(sessionId!);
      toast({
        title: "Session Deleted",
        description: "Session has been deleted successfully.",
        variant: "success",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete session.",
        variant: "destructive",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading summary...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-400">Session not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
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
                  Session Summary
                </h1>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Session
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Session</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this session? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {}}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteSession}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Total Bill Card */}
          <motion.div variants={cardVariants} className="mb-8">
            <Card className="glassmorphism luxury-border luxury-gradient">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <TrendingUp className="w-8 h-8 text-yellow-500 mr-3" />
                    <h2 className="text-4xl font-serif font-bold luxury-text-gradient">
                      Total Bill
                    </h2>
                  </div>
                  <div className="text-6xl font-bold luxury-text-gradient mb-4">
                    {formatCurrency(summary.totalOrderAmount)}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Total Order:</span>
                      <div className="font-semibold">
                        {formatCurrency(summary.totalOrderAmount)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Friends:</span>
                      <div className="font-semibold">
                        {summary.friendsCount}/{summary.expectedFriendsCount}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Summary */}
          <motion.div variants={cardVariants} className="mb-8">
            <Card className="glassmorphism luxury-border">
              <CardHeader>
                <CardTitle className="text-xl luxury-text-gradient flex items-center">
                  <Receipt className="w-5 h-5 mr-2" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="text-2xl font-bold text-green-400">
                      {formatCurrency(
                        summary.totalPaidInstaPay + summary.totalPaidCash
                      )}
                    </div>
                    <div className="text-sm text-gray-400">Paid</div>
                  </div>
                  <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                    <div className="text-2xl font-bold text-red-400">
                      {formatCurrency(summary.totalUnpaid)}
                    </div>
                    <div className="text-sm text-gray-400">Unpaid</div>
                  </div>
                  <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="text-2xl font-bold text-blue-400">
                      {summary.friendsCount}
                    </div>
                    <div className="text-sm text-gray-400">Friends</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 text-yellow-500 mr-2" />
                      <span className="text-gray-400">InstaPay Total:</span>
                    </div>
                    <span className="font-semibold text-yellow-400">
                      {formatCurrency(summary.totalPaidInstaPay)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-gray-400">Cash Total:</span>
                    </div>
                    <span className="font-semibold text-green-400">
                      {formatCurrency(summary.totalPaidCash)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Friends List */}
          <motion.div variants={cardVariants}>
            <Card className="glassmorphism luxury-border">
              <CardHeader>
                <CardTitle className="text-xl luxury-text-gradient flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Friends & Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AnimatePresence>
                    {summary.friends.map((friend) => (
                      <motion.div
                        key={friend.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="border border-gray-700 rounded-lg p-4 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-white">
                              {friend.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              {(
                                typeof friend.paymentMethod === "boolean"
                                  ? friend.paymentMethod
                                  : friend.paymentMethod === "InstaPay"
                              ) ? (
                                <CreditCard className="w-4 h-4 text-yellow-500" />
                              ) : (
                                <DollarSign className="w-4 h-4 text-green-500" />
                              )}
                              <span className="text-sm text-gray-400">
                                {typeof friend.paymentMethod === "boolean"
                                  ? friend.paymentMethod
                                    ? "InstaPay"
                                    : "Cash"
                                  : friend.paymentMethod}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className="text-lg font-bold luxury-text-gradient">
                                {formatCurrency(friend.totalAmount)}
                              </div>
                              <div className="text-sm text-gray-400">
                                {friend.products.length} item
                                {friend.products.length !== 1 ? "s" : ""}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={friend.hasPaid}
                                onCheckedChange={(checked) =>
                                  handlePaymentToggle(friend.id, checked)
                                }
                                disabled={updatingPayments.has(friend.id)}
                              />
                              {friend.hasPaid ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                            </div>
                          </div>
                        </div>

                        {friend.products.length > 0 && (
                          <div className="space-y-2">
                            {friend.products.map((product) => (
                              <div
                                key={product.id}
                                className="flex justify-between text-sm text-gray-400"
                              >
                                <span>
                                  {product.productName} × {product.quantity}
                                </span>
                                <span>
                                  {formatCurrency(
                                    product.unitPrice * product.quantity
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SessionSummary;
