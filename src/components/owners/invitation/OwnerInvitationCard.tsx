import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface OwnerInvitationCardProps {
  title: string;
  children: ReactNode;
}

export const OwnerInvitationCard = ({ title, children }: OwnerInvitationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};