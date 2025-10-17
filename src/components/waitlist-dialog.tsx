
"use client";

import { useState, type ReactNode, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { track } from "@/lib/analytics";
import { useIsMobile } from "@/hooks/use-mobile";

const waitlistSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.enum(["DJ", "Floor", "Manager", "Owner", "Other"], { required_error: "Please select a role." }),
  clubName: z.string().min(2, { message: "Club name must be at least 2 characters." }),
  cityState: z.string().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  honeypot: z.string().optional(), // Honeypot field
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

interface WaitlistDialogProps {
  children: ReactNode;
  onOpen?: () => void;
}

function WaitlistForm({ setIsSubmitting, closeDialog }: { setIsSubmitting: (isSubmitting: boolean) => void; closeDialog: () => void; }) {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      fullName: "",
      email: "",
      clubName: "",
      cityState: "",
      phone: "",
      notes: "",
      honeypot: "",
    },
  });

  async function onSubmit(data: WaitlistFormData) {
    if (data.honeypot) {
      console.log("Bot submission detected.");
      return;
    }
    setIsSubmitting(true);

    const utm_source = searchParams.get('utm_source');
    const utm_medium = searchParams.get('utm_medium');
    const utm_campaign = searchParams.get('utm_campaign');

    const payload = { ...data, utm_source, utm_medium, utm_campaign };

    try {
      const response = await fetch("/api/submit-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Something went wrong. Please try again.");
      }
      
      track('waitlist_submit_success');
      toast({
        title: "Success!",
        description: "You're on the list. We'll email invites as we open up.",
      });
      form.reset();
      closeDialog();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="clubName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Club Name *</FormLabel>
                <FormControl>
                  <Input placeholder="The Velvet Rope" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DJ">DJ</SelectItem>
                    <SelectItem value="Floor">Floor Staff</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Owner">Owner</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cityState"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City / State</FormLabel>
                <FormControl>
                  <Input placeholder="Las Vegas, NV" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone <span className="text-muted-foreground">(Optional)</span></FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="(555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes <span className="text-muted-foreground">(Optional)</span></FormLabel>
              <FormControl>
                <Textarea placeholder="Anything else you'd like to share?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="honeypot"
          render={({ field }) => (
            <FormItem className="visually-hidden">
              <FormLabel>Don't fill this out</FormLabel>
              <FormControl>
                <Input {...field} tabIndex={-1} autoComplete="off" />
              </FormControl>
            </FormItem>
          )}
        />
        <DialogFooter className="pt-4 flex-col sm:flex-row-reverse sm:items-center">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto" size="lg" data-sf-join>
              {isSubmitting ? "Submitting..." : "Join Waitlist"}
            </Button>
            <DialogClose asChild>
                <Button type="button" variant="ghost" className="w-full sm:w-auto">Close</Button>
            </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  )
}

export function WaitlistDialog({ children, onOpen }: WaitlistDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();
  
  const handleOpenChange = (open: boolean) => {
    if(open && onOpen) {
      onOpen();
    }
    setIsOpen(open);
  }

  const closeDialog = () => {
    setIsOpen(false);
  }

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild data-dialog="waitlist">{children}</SheetTrigger>
        <SheetContent 
          side="bottom" 
          id="waitlist-dialog" 
          className="bg-card/95 backdrop-blur-sm border-t border-primary/20 rounded-t-lg p-0"
          style={{ overscrollBehavior: 'contain'}}
        >
          <div className="h-full flex flex-col">
            <SheetHeader className="p-4 border-b border-primary/20 sticky top-0 bg-card/95 z-10">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-left">Join the Waitlist</SheetTitle>
                <SheetClose className="relative rounded-sm opacity-100 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary h-auto p-0">
                  <div className="flex flex-col items-center p-1">
                    <X className="h-6 w-6" />
                    <span className="text-xs text-muted-foreground">Close</span>
                  </div>
                  <span className="sr-only">Close</span>
                </SheetClose>
              </div>
            </SheetHeader>
            <div className="flex-grow overflow-y-auto p-4">
               <WaitlistForm setIsSubmitting={setIsSubmitting} closeDialog={closeDialog} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild data-dialog="waitlist">{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-card/95 backdrop-blur-sm border-primary/20" id="waitlist-dialog">
        <DialogHeader>
          <DialogTitle>Join the Waitlist</DialogTitle>
          <DialogDescription>
            Get early access to Clockwork Venue and be the first to know about launch discounts.
          </DialogDescription>
        </DialogHeader>
        <WaitlistForm setIsSubmitting={setIsSubmitting} closeDialog={closeDialog} />
      </DialogContent>
    </Dialog>
  );
}

    
