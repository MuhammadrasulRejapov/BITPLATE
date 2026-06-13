import { Badge } from "../ui/badge";

interface StatusBadgeProps {
  status: string;
  type?: 'table' | 'order' | 'reservation';
}

export function StatusBadge({ status, type = 'table' }: StatusBadgeProps) {
  const getStatusColor = () => {
    if (type === 'table') {
      switch (status) {
        case 'Free':
          return 'bg-[#10b981] hover:bg-[#10b981]';
        case 'Reserved':
          return 'bg-[#3b82f6] hover:bg-[#3b82f6]';
        case 'Occupied':
          return 'bg-[#fbbf24] hover:bg-[#fbbf24]';
        case 'AwaitingBill':
          return 'bg-[#f59e0b] hover:bg-[#f59e0b]';
        case 'Cleared':
          return 'bg-[#6b7280] hover:bg-[#6b7280]';
        default:
          return 'bg-gray-500 hover:bg-gray-500';
      }
    } else if (type === 'order') {
      switch (status) {
        case 'Pending':
          return 'bg-[#fbbf24] hover:bg-[#fbbf24]';
        case 'Preparing':
          return 'bg-[#3b82f6] hover:bg-[#3b82f6]';
        case 'Ready':
          return 'bg-[#10b981] hover:bg-[#10b981]';
        case 'Served':
          return 'bg-[#6b7280] hover:bg-[#6b7280]';
        default:
          return 'bg-gray-500 hover:bg-gray-500';
      }
    } else {
      switch (status) {
        case 'Pending':
          return 'bg-[#fbbf24] hover:bg-[#fbbf24]';
        case 'Confirmed':
          return 'bg-[#10b981] hover:bg-[#10b981]';
        case 'Cancelled':
          return 'bg-[#6b7280] hover:bg-[#6b7280]';
        default:
          return 'bg-gray-500 hover:bg-gray-500';
      }
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'Free':
        return "Bo'sh";
      case 'Reserved':
        return 'Bron';
      case 'Occupied':
        return 'Band';
      case 'AwaitingBill':
        return 'Hisob kutilmoqda';
      case 'Cleared':
        return 'Tozalanmoqda';
      case 'Pending':
        return 'Kutilmoqda';
      case 'Preparing':
        return 'Tayyorlanmoqda';
      case 'Ready':
        return 'Tayyor';
      case 'Served':
        return 'Xizmat qilindi';
      case 'Confirmed':
        return 'Tasdiqlangan';
      case 'Cancelled':
        return 'Bekor qilindi';
      default:
        return status;
    }
  };

  return (
    <Badge className={`${getStatusColor()} text-white`}>
      {getStatusText()}
    </Badge>
  );
}
