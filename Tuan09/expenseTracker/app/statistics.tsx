import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { LineChart, BarChart } from "react-native-chart-kit";
import { getMonthlyStatistics, getAllTransactions } from "../database/db";

const screenWidth = Dimensions.get("window").width;

interface MonthlyData {
  month: string;
  type: string;
  total: number;
}

export default function StatisticsScreen() {
  const router = useRouter();
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [chartData, setChartData] = useState<any>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadStatistics();
    }, [])
  );

  const loadStatistics = () => {
    const data = getMonthlyStatistics() as MonthlyData[];
    setMonthlyData(data);
    processChartData(data);
  };

  const processChartData = (data: MonthlyData[]) => {
    // Lấy 6 tháng gần nhất
    const months = [...new Set(data.map((item) => item.month))]
      .slice(0, 6)
      .reverse();

    const incomeData: number[] = [];
    const expenseData: number[] = [];

    months.forEach((month) => {
      const incomeItem = data.find(
        (item) => item.month === month && item.type === "Thu"
      );
      const expenseItem = data.find(
        (item) => item.month === month && item.type === "Chi"
      );

      incomeData.push(incomeItem ? incomeItem.total : 0);
      expenseData.push(expenseItem ? expenseItem.total : 0);
    });

    // Format labels (MM/YYYY -> MM/YY)
    const labels = months.map((month) => {
      const [year, monthNum] = month.split("-");
      return `${monthNum}/${year.slice(2)}`;
    });

    setChartData({
      labels,
      datasets: [
        {
          data: incomeData,
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // green
          strokeWidth: 2,
        },
        {
          data: expenseData,
          color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`, // red
          strokeWidth: 2,
        },
      ],
      legend: ["Thu", "Chi"],
    });
  };

  const formatAmount = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  // Tính tổng thu chi
  const calculateTotals = () => {
    const allTransactions = getAllTransactions() as any[];
    let totalIncome = 0;
    let totalExpense = 0;

    allTransactions.forEach((item: any) => {
      if (item.type === "Thu") {
        totalIncome += item.amount;
      } else {
        totalExpense += item.amount;
      }
    });

    return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
  };

  const totals = calculateTotals();

  const formatFullAmount = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thống Kê</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, styles.incomeCard]}>
            <Text style={styles.summaryIcon}>💰</Text>
            <Text style={styles.summaryLabel}>Tổng Thu</Text>
            <Text style={styles.summaryAmount}>
              {formatFullAmount(totals.totalIncome)} đ
            </Text>
          </View>

          <View style={[styles.summaryCard, styles.expenseCard]}>
            <Text style={styles.summaryIcon}>💸</Text>
            <Text style={styles.summaryLabel}>Tổng Chi</Text>
            <Text style={styles.summaryAmount}>
              {formatFullAmount(totals.totalExpense)} đ
            </Text>
          </View>
        </View>

        <View style={[styles.summaryCard, styles.balanceCard]}>
          <Text style={styles.summaryIcon}>💵</Text>
          <Text style={styles.summaryLabel}>Số Dư</Text>
          <Text
            style={[
              styles.summaryAmount,
              { color: totals.balance >= 0 ? "#4CAF50" : "#F44336" },
            ]}
          >
            {formatFullAmount(totals.balance)} đ
          </Text>
        </View>

        {/* Chart Section */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>📊 Biểu đồ Thu - Chi theo Tháng</Text>

          {chartData && chartData.labels.length > 0 ? (
            <>
              <View style={styles.chartContainer}>
                <LineChart
                  data={chartData}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={{
                    backgroundColor: "#ffffff",
                    backgroundGradientFrom: "#ffffff",
                    backgroundGradientTo: "#ffffff",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: "4",
                      strokeWidth: "2",
                    },
                    formatYLabel: (value) => formatAmount(Number(value)),
                  }}
                  bezier
                  style={styles.chart}
                />
              </View>

              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendDot, { backgroundColor: "#4CAF50" }]}
                  />
                  <Text style={styles.legendText}>Thu nhập</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendDot, { backgroundColor: "#F44336" }]}
                  />
                  <Text style={styles.legendText}>Chi tiêu</Text>
                </View>
              </View>

              {/* Bar Chart */}
              <Text style={styles.chartTitle}>📈 So sánh Thu - Chi</Text>
              <View style={styles.chartContainer}>
                <BarChart
                  data={{
                    labels: chartData.labels,
                    datasets: [
                      {
                        data: chartData.datasets[0].data, // Thu
                      },
                      {
                        data: chartData.datasets[1].data, // Chi
                      },
                    ],
                  }}
                  width={screenWidth - 40}
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix=""
                  chartConfig={{
                    backgroundColor: "#ffffff",
                    backgroundGradientFrom: "#ffffff",
                    backgroundGradientTo: "#ffffff",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    formatYLabel: (value) => formatAmount(Number(value)),
                  }}
                  style={styles.chart}
                />
              </View>
            </>
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyChartIcon}>📊</Text>
              <Text style={styles.emptyChartText}>
                Chưa có dữ liệu thống kê
              </Text>
              <Text style={styles.emptyChartSubText}>
                Thêm giao dịch để xem biểu đồ
              </Text>
            </View>
          )}
        </View>

        {/* Monthly Detail */}
        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>📅 Chi tiết theo Tháng</Text>
          {monthlyData.length > 0 ? (
            <View style={styles.detailList}>
              {[...new Set(monthlyData.map((item) => item.month))]
                .slice(0, 6)
                .map((month) => {
                  const incomeItem = monthlyData.find(
                    (item) => item.month === month && item.type === "Thu"
                  );
                  const expenseItem = monthlyData.find(
                    (item) => item.month === month && item.type === "Chi"
                  );
                  const income = incomeItem ? incomeItem.total : 0;
                  const expense = expenseItem ? expenseItem.total : 0;
                  const balance = income - expense;

                  return (
                    <View key={month} style={styles.detailItem}>
                      <Text style={styles.detailMonth}>{month}</Text>
                      <View style={styles.detailAmounts}>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Thu:</Text>
                          <Text
                            style={[styles.detailAmount, styles.incomeText]}
                          >
                            +{formatFullAmount(income)} đ
                          </Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Chi:</Text>
                          <Text
                            style={[styles.detailAmount, styles.expenseText]}
                          >
                            -{formatFullAmount(expense)} đ
                          </Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Còn:</Text>
                          <Text
                            style={[
                              styles.detailAmount,
                              { color: balance >= 0 ? "#4CAF50" : "#F44336" },
                            ]}
                          >
                            {formatFullAmount(balance)} đ
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
            </View>
          ) : (
            <View style={styles.emptyDetail}>
              <Text style={styles.emptyDetailText}>
                Chưa có dữ liệu chi tiết
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2196F3",
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  placeholder: {
    width: 70,
  },
  summaryContainer: {
    flexDirection: "row",
    padding: 15,
    gap: 15,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  incomeCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
  },
  balanceCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  summaryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  chartSection: {
    padding: 20,
    paddingTop: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  chartContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 20,
  },
  chart: {
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
    marginBottom: 30,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: "#666",
  },
  emptyChart: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  emptyChartIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyChartText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
  },
  emptyChartSubText: {
    fontSize: 14,
    color: "#999",
  },
  detailSection: {
    padding: 20,
    paddingTop: 0,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  detailList: {
    gap: 15,
  },
  detailItem: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  detailMonth: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 10,
  },
  detailAmounts: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailAmount: {
    fontSize: 14,
    fontWeight: "600",
  },
  incomeText: {
    color: "#4CAF50",
  },
  expenseText: {
    color: "#F44336",
  },
  emptyDetail: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
  },
  emptyDetailText: {
    fontSize: 14,
    color: "#999",
  },
});
