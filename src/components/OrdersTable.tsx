
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Save, Check } from "lucide-react";
import { toast } from "sonner";

interface OrdersTableProps {
  data: any[];
  sheetName: string;
  updateCell?: (sheetName: string, row: number, col: number, value: string) => Promise<boolean>;
}

interface EditState {
  [key: string]: boolean;
}

const OrdersTable = ({ data, sheetName, updateCell }: OrdersTableProps) => {
  const [editableData, setEditableData] = useState<any[]>(data);
  const [editState, setEditState] = useState<EditState>({});

  // Define the status options
  const statusOptions = [
    "รอดำเนินการ",
    "กำลังออกแบบ",
    "รอการอนุมัติ",
    "เตรียมจัดส่ง",
    "จัดส่งแล้ว",
    "ยกเลิก"
  ];

  const toggleEdit = (id: number, field: string) => {
    const key = `${id}-${field}`;
    setEditState(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleChange = (id: number, field: string, value: string | number) => {
    const updatedData = editableData.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setEditableData(updatedData);
  };

  const handleSave = async (id: number, field: string) => {
    const item = editableData.find(item => item.id === id);
    if (!item) return;

    // ในตอนนี้เป็นเพียงแค่การจำลอง การส่งข้อมูลจริงต้องใช้ตำแหน่งและค่าที่ถูกต้อง
    const rowIndex = id + 2; // +2 เพราะ row 0 คือ header และ id เริ่มจาก 0
    let colIndex = 0;
    
    switch (field) {
      case "orderNumber": colIndex = 0; break;
      case "purchaseOrder": colIndex = 1; break;
      case "childDetails": colIndex = 2; break;
      case "designType": colIndex = 3; break;
      case "quantity": colIndex = 4; break;
      case "trackingNumber": colIndex = 5; break;
      case "status": colIndex = 6; break;
      case "notes": colIndex = 7; break;
      default: colIndex = 0;
    }

    if (updateCell) {
      const success = await updateCell(sheetName, rowIndex, colIndex, String(item[field]));
      if (success) {
        toggleEdit(id, field);
      }
    } else {
      toast.success("บันทึกข้อมูลสำเร็จ (ทดสอบ)");
      toggleEdit(id, field);
    }
  };

  // Helper function to render editable cell
  const renderEditableCell = (item: any, field: string, type: string = "text") => {
    const key = `${item.id}-${field}`;
    const isEditing = editState[key];

    // Don't make status field editable with text input
    if (field === "status") {
      return (
        <Select 
          value={item[field]} 
          onValueChange={(value) => handleChange(item.id, field, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="เลือกสถานะ" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return isEditing ? (
      <div className="flex items-center gap-2">
        <Input
          type={type}
          value={item[field]}
          onChange={(e) => handleChange(item.id, field, e.target.value)}
          className="h-8 w-full"
        />
        <Button 
          onClick={() => handleSave(item.id, field)} 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
        >
          <Save className="h-4 w-4" />
        </Button>
      </div>
    ) : (
      <div className="flex items-center justify-between">
        <span>{item[field]}</span>
        <Button 
          onClick={() => toggleEdit(item.id, field)} 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[100px]">เลขออเดอร์</TableHead>
            <TableHead>เลขคำสั่งซื้อ</TableHead>
            <TableHead className="w-[250px]">ชื่อเด็กพร้อมรายละเอียด</TableHead>
            <TableHead>แบบที่</TableHead>
            <TableHead>จำนวน</TableHead>
            <TableHead>เลขพัสดุ</TableHead>
            <TableHead>สถานะ</TableHead>
            <TableHead>หมายเหตุ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {editableData.length > 0 ? (
            editableData.map((item) => (
              <TableRow key={item.id} className="group">
                <TableCell>{renderEditableCell(item, "orderNumber")}</TableCell>
                <TableCell>{renderEditableCell(item, "purchaseOrder")}</TableCell>
                <TableCell>{renderEditableCell(item, "childDetails")}</TableCell>
                <TableCell>{renderEditableCell(item, "designType")}</TableCell>
                <TableCell>{renderEditableCell(item, "quantity", "number")}</TableCell>
                <TableCell>{renderEditableCell(item, "trackingNumber")}</TableCell>
                <TableCell>{renderEditableCell(item, "status")}</TableCell>
                <TableCell>{renderEditableCell(item, "notes")}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                ไม่มีข้อมูลในชีตนี้
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;
