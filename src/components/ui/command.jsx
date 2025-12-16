"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Command as CommandPrimitive } from "cmdk"
import { Dialog, DialogContent } from "./dialog"

/* Root command wrapper */
const Command = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = "Command"

/* Command inside dialog */
export function CommandDialog({ children, ...props }) {
  return (
    <Dialog {...props}>
      <DialogContent
        className="overflow-hidden p-0 shadow-xl max-w-xl"
      >
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

/* Input */
const CommandInput = React.forwardRef(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3">
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground",
        className
      )}
      {...props}
    />
  </div>
))
CommandInput.displayName = "CommandInput"

/* List */
const CommandList = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[400px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
))
CommandList.displayName = "CommandList"

/* Empty state */
const CommandEmpty = React.forwardRef((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm text-muted-foreground"
    {...props}
  />
))
CommandEmpty.displayName = "CommandEmpty"

/* Group */
const CommandGroup = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden px-2 py-2 text-foreground",
      "[&_div[cmdk-group-heading]]:px-2",
      "[&_div[cmdk-group-heading]]:text-xs",
      "[&_div[cmdk-group-heading]]:font-medium",
      "[&_div[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
))
CommandGroup.displayName = "CommandGroup"

/* Separator */
const CommandSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = "CommandSeparator"

/* Item */
const CommandItem = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none",
      "aria-selected:bg-accent aria-selected:text-accent-foreground",
      className
    )}
    {...props}
  />
))
CommandItem.displayName = "CommandItem"

/* Shortcut */
const CommandShortcut = ({ className, ...props }) => (
  <span
    className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
    {...props}
  />
)

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandSeparator,
  CommandItem,
  CommandShortcut,
}
