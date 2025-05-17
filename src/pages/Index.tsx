
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrdersTable from "@/components/OrdersTable";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const Index = () => {
  const [activeTab, setActiveTab] = useState("17/05/68");
  const { isLoading, sheetData, summary } = useGoogleSheets(activeTab);
  
  const dateOptions = [
    "17/05/68", "18/05/68", "19/05/68", "20/05/68", 
    "21/05/68", "22/05/68", "23/05/68", "24/05/68", 
    "25/05/68", "26/05/68", "27/05/68", "28/05/68", 
    "29/05/68", "30/05/68"
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">DTF Dashboard</h1>
          <p className="text-gray-600 mt-2">เชื่อมต่อกับ Google Sheets</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">จำนวนออเดอร์</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">
                {isLoading ? <LoadingSpinner size="sm" /> : summary.totalOrders}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">รอออกแบบ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">
                {isLoading ? <LoadingSpinner size="sm" /> : summary.pendingDesign}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">จัดส่ง</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {isLoading ? <LoadingSpinner size="sm" /> : summary.shipped}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation for Sheet Selection */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b mb-4 overflow-x-auto">
            <TabsList className="flex h-10">
              {dateOptions.map((date) => (
                <TabsTrigger
                  key={date}
                  value={date}
                  className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-purple-500"
                >
                  {date}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {/* Table Section */}
          <div className="bg-white shadow-md rounded-md p-4 overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <OrdersTable data={sheetData} sheetName={activeTab} />
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
