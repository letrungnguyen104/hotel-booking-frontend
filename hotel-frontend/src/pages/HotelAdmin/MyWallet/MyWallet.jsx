import React, { useEffect, useState } from "react";
import { Card, Statistic, Button, Table, Modal, Form, Input, InputNumber, Tag, Row, Col, Avatar, Select } from "antd";
import { DollarOutlined, BankOutlined, HistoryOutlined } from "@ant-design/icons";
import { getMyWallet, requestWithdrawal, getWithdrawalHistory } from "@/service/walletService";
import { getBankList } from "@/service/bankService";
import { toast } from "sonner";
import dayjs from "dayjs";
import "./MyWallet.scss";

const { Option } = Select;

const MyWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);

  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [walletData, historyData] = await Promise.all([
        getMyWallet(),
        getWithdrawalHistory()
      ]);
      setWallet(walletData);
      setHistory(historyData);
    } catch (error) {
      console.error("Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  const fetchBanks = async () => {
    if (banks.length > 0) return;
    setLoadingBanks(true);
    try {
      const bankList = await getBankList();
      setBanks(bankList);
    } catch (error) {
      console.error("Failed to load banks");
    } finally {
      setLoadingBanks(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    fetchBanks();
  }

  const handleWithdraw = async (values) => {
    setSubmitting(true);
    try {
      await requestWithdrawal(values);
      toast.success("Withdrawal request submitted successfully!");
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  const filterBankOption = (input, option) => {
    return (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) ||
      (option?.searchValue ?? '').toLowerCase().includes(input.toLowerCase());
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 70,
      align: 'center',
      render: (text) => <span style={{ color: '#8c8c8c' }}>#{text}</span>
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: 150,
      render: (val) => <span className="amount-negative">-{val.toLocaleString()} ₫</span>
    },
    {
      title: "Bank Info",
      render: (_, record) => (
        <div className="bank-info">
          <div className="bank-name">{record.bankName}</div>
          <div className="bank-detail">{record.bankAccountNumber} • {record.accountHolderName}</div>
        </div>
      )
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      width: 160,
      render: (date) => <span className="date-text">{dayjs(date).format("DD/MM/YYYY HH:mm")}</span>
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      align: 'center',
      render: (status) => {
        let color = status === 'PENDING' ? 'gold' : status === 'APPROVED' ? 'success' : 'error';
        return <Tag color={color} style={{ fontWeight: 600 }}>{status}</Tag>;
      }
    }
  ];

  return (
    <div className="my-wallet-page">
      <h2>My Business Wallet</h2>

      <Row gutter={24}>
        <Col span={24} lg={8}>
          <Card className="balance-card" bordered={false}>
            <Statistic
              title="Available Balance"
              value={wallet?.balance || 0}
              precision={0}
              prefix={<DollarOutlined />}
              suffix="VND"
            />
            <Button
              type="primary"
              icon={<BankOutlined />}
              className="withdraw-btn"
              block
              onClick={handleOpenModal}
              disabled={!wallet || wallet.balance < 100000}
            >
              Request Withdrawal
            </Button>
            <div className="min-withdraw-note">
              * Minimum withdrawal: 100,000 VND
            </div>
          </Card>
        </Col>

        <Col span={24} lg={16}>
          <Card className="history-card" title={<span><HistoryOutlined /> Transaction History</span>} bordered={false}>
            <Table
              dataSource={history}
              columns={columns}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 6 }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="Request Withdrawal"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleWithdraw} style={{ marginTop: 20 }}>
          <Form.Item
            name="amount"
            label="Amount (VND)"
            rules={[
              { required: true, message: "Please enter amount" },
              { type: 'number', min: 100000, message: "Minimum 100,000 VND" },
              {
                validator: (_, value) =>
                  value > (wallet?.balance || 0)
                    ? Promise.reject("Insufficient balance")
                    : Promise.resolve()
              }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter amount"
              size="large"
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item name="bankName" label="Bank Name" rules={[{ required: true, message: "Please select a bank" }]}>
            <Select
              showSearch
              placeholder="Select bank (e.g. Vietcombank)"
              size="large"
              loading={loadingBanks}
              optionLabelProp="label"
              filterOption={filterBankOption}
              virtual={false}
            >
              {banks.map(bank => (
                <Option
                  key={bank.id}
                  value={`${bank.shortName} - ${bank.name}`}
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img
                        src={bank.logo}
                        alt={bank.shortName}
                        style={{ width: 24, height: 24, objectFit: 'contain' }}
                      />
                      <span>{bank.shortName} - {bank.name}</span>
                    </div>
                  }

                  searchValue={`${bank.shortName} ${bank.name} ${bank.code}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img
                      src={bank.logo}
                      alt={bank.shortName}
                      style={{ width: 50, objectFit: 'contain', height: 20 }}
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600 }}>{bank.shortName}</div>
                      <div style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 250 }}>
                        {bank.name}
                      </div>
                    </div>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="bankAccountNumber" label="Account Number" rules={[{ required: true, message: "Please enter account number" }]}>
            <Input placeholder="e.g. 001100..." size="large" />
          </Form.Item>

          <Form.Item
            name="accountHolderName"
            label="Account Holder Name"
            rules={[{ required: true, message: "Please enter account holder name" }]}
            help="Must match the name registered with the bank"
          >
            <Input
              placeholder="e.g. NGUYEN VAN A"
              style={{ textTransform: 'uppercase' }}
              size="large"
              onChange={(e) => form.setFieldsValue({ accountHolderName: e.target.value.toUpperCase() })}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large" loading={submitting} style={{ marginTop: 10 }}>
            Submit Request
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default MyWallet;