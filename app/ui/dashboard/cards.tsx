import React from "react";
import { Card as GenericCard, CardContent, CardHeader } from "@/app/ui/components/Card";
import { roboto } from "@/app/ui/fonts";
import { CardProps } from "@/app/lib/definitions";

export function Card({ title, value, icon }: CardProps) {
  return (
    <GenericCard className="p-2">
      <CardHeader className="flex flex-row items-center p-4">
        {icon}
        <h3 className="ml-2 text-sm font-medium text-text/90">{title}</h3>
      </CardHeader>
      <CardContent className="p-0">
        <p
          className={`${roboto.className} truncate rounded-xl bg-background/50 px-4 py-8 text-center text-2xl text-text`}
        >
          {value}
        </p>
      </CardContent>
    </GenericCard>
  );
}
