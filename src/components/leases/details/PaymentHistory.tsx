import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface Payment {
  id: string;
  due_date: string;
  paid_date: string | null;
  amount: number;
  status: string;
}

interface PaymentHistoryProps {
  payments: Payment[];
}

export const PaymentHistory = ({ payments }: PaymentHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        {payments && payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    Due: {format(new Date(payment.due_date), 'PPP')}
                  </p>
                  {payment.paid_date && (
                    <p className="text-sm text-muted-foreground">
                      Paid: {format(new Date(payment.paid_date), 'PPP')}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium">${payment.amount.toLocaleString()}</p>
                  <p className={`text-sm ${
                    payment.status === 'PAID' 
                      ? 'text-green-600' 
                      : payment.status === 'PENDING' 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                  }`}>
                    {payment.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No payment records found</p>
        )}
      </CardContent>
    </Card>
  );
};