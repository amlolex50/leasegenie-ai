import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Mail, Phone, User } from "lucide-react";
import { Owner } from "../types";
import { useState } from "react";
import { OwnerUpdateDialog } from "../OwnerUpdateDialog";

interface OwnerCardProps {
  owner: Owner;
}

export const OwnerCard = ({ owner }: OwnerCardProps) => {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              {owner.full_name}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {owner.company_name && (
            <div className="flex items-start gap-2">
              <Building2 className="h-4 w-4 mt-1 text-gray-500" />
              <div>
                <p className="text-sm font-medium">{owner.company_name}</p>
                <p className="text-xs text-muted-foreground">Company</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-2">
            <Mail className="h-4 w-4 mt-1 text-gray-500" />
            <div>
              <p className="text-sm font-medium">{owner.email}</p>
              <p className="text-xs text-muted-foreground">Email</p>
            </div>
          </div>
          {owner.phone && (
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 mt-1 text-gray-500" />
              <div>
                <p className="text-sm font-medium">{owner.phone}</p>
                <p className="text-xs text-muted-foreground">Phone</p>
              </div>
            </div>
          )}
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => setShowUpdateDialog(true)}
          >
            Edit Details
          </Button>
        </CardContent>
      </Card>

      <OwnerUpdateDialog
        open={showUpdateDialog}
        onOpenChange={setShowUpdateDialog}
        owner={owner}
      />
    </>
  );
};