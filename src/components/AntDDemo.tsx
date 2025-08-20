import React, { useState } from 'react';
import {
  Button,
  Card,
  Typography,
  Space,
  Row,
  Col,
  Form,
  Input,
  Select,
  Table,
  Tag,
  Badge,
  List,
  Statistic,
  Progress,
  Alert,
  message,
  Modal,
  Drawer,
  Tabs,
  Divider,
  Popconfirm,
  Switch,
  Slider,
  Rate,
  Upload,
  Timeline,
  Steps,
  Collapse,
  Empty,
  Skeleton,
  Spin,
  notification,
} from 'antd';
import {
  UserOutlined,
  HeartOutlined,
  StarOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UploadOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  TrophyOutlined,
  FireOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Step } = Steps;

// Sample data for table
const tableData = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
    status: 'active',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['manager'],
    status: 'inactive',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
    status: 'active',
  },
];

const tableColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (tags: string[]) => (
      <>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: (status: string) => (
      <Badge 
        status={status === 'active' ? 'success' : 'default'} 
        text={status} 
      />
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <Space size="middle">
        <Button type="link" icon={<EditOutlined />} size="small">
          Edit
        </Button>
        <Popconfirm
          title="Are you sure to delete this item?"
          onConfirm={() => message.success('Deleted successfully')}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger icon={<DeleteOutlined />} size="small">
            Delete
          </Button>
        </Popconfirm>
      </Space>
    ),
  },
];

export const AntDDemo: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  const showModal = () => setIsModalVisible(true);
  const handleModalOk = () => {
    setIsModalVisible(false);
    message.success('Modal action completed');
  };
  const handleModalCancel = () => setIsModalVisible(false);

  const showDrawer = () => setIsDrawerVisible(true);
  const handleDrawerClose = () => setIsDrawerVisible(false);

  const handleFormSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Form submitted successfully!');
      form.resetFields();
    }, 1000);
  };

  const showNotification = (type: 'success' | 'info' | 'warning' | 'error') => {
    notification[type]({
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} Notification`,
      description: `This is a ${type} notification message.`,
      placement: 'topRight',
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Title level={1} style={{ color: '#1890ff', marginBottom: '16px' }}>
          Ant Design Demo
        </Title>
        <Paragraph style={{ fontSize: '18px', color: '#666' }}>
          Enterprise-level UI design language and React UI library with comprehensive components
        </Paragraph>
        <Space size="large">
          <Statistic title="Components" value={70} suffix="+" />
          <Statistic title="Design Patterns" value={100} suffix="+" />
          <Statistic title="Customizable" value={100} suffix="%" />
        </Space>
      </div>

      {/* Tabs Navigation */}
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        type="card"
        size="large"
        style={{ marginBottom: '32px' }}
      >
        <TabPane tab="Components" key="1">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Buttons Section */}
            <Card title="Buttons & Actions" size="default">
              <Space wrap>
                <Button type="primary" icon={<PlusOutlined />}>
                  Primary
                </Button>
                <Button icon={<EditOutlined />}>Default</Button>
                <Button type="dashed" icon={<SettingOutlined />}>
                  Dashed
                </Button>
                <Button type="text" icon={<HeartOutlined />}>
                  Text
                </Button>
                <Button type="link" icon={<StarOutlined />}>
                  Link
                </Button>
              </Space>
              <Divider />
              <Space wrap>
                <Button size="large" type="primary">
                  Large
                </Button>
                <Button type="primary">Default</Button>
                <Button size="small" type="primary">
                  Small
                </Button>
              </Space>
              <Divider />
              <Space wrap>
                <Button type="primary" loading>
                  Loading
                </Button>
                <Button type="primary" danger>
                  Danger
                </Button>
                <Button type="primary" ghost>
                  Ghost
                </Button>
                <Button type="primary" disabled>
                  Disabled
                </Button>
              </Space>
            </Card>

            {/* Form Section */}
            <Card title="Form Elements" size="default">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFormSubmit}
                style={{ maxWidth: '600px' }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Full Name"
                      name="fullName"
                      rules={[{ required: true, message: 'Please input your full name!' }]}
                    >
                      <Input 
                        prefix={<UserOutlined />} 
                        placeholder="Enter your full name" 
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                      ]}
                    >
                      <Input 
                        prefix={<MailOutlined />} 
                        placeholder="Enter your email" 
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Phone"
                      name="phone"
                      rules={[{ required: true, message: 'Please input your phone number!' }]}
                    >
                      <Input 
                        prefix={<PhoneOutlined />} 
                        placeholder="Enter your phone" 
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Country"
                      name="country"
                      rules={[{ required: true, message: 'Please select your country!' }]}
                    >
                      <Select placeholder="Select your country">
                        <Option value="us">United States</Option>
                        <Option value="uk">United Kingdom</Option>
                        <Option value="ca">Canada</Option>
                        <Option value="au">Australia</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password 
                    prefix={<LockOutlined />} 
                    placeholder="Enter your password" 
                  />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Submit
                    </Button>
                    <Button onClick={() => form.resetFields()}>
                      Reset
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>

            {/* Data Display Section */}
            <Card title="Data Display" size="default">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card size="small">
                    <Statistic
                      title="Active Users"
                      value={112893}
                      prefix={<TeamOutlined />}
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small">
                    <Statistic
                      title="Success Rate"
                      value={93.2}
                      suffix="%"
                      prefix={<TrophyOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small">
                    <Statistic
                      title="Performance"
                      value={88.5}
                      suffix="%"
                      prefix={<FireOutlined />}
                      valueStyle={{ color: '#cf1322' }}
                    />
                  </Card>
                </Col>
              </Row>
              <Divider />
              <div style={{ marginBottom: '16px' }}>
                <Text strong>Progress Indicators:</Text>
              </div>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text>Basic Progress</Text>
                  <Progress percent={30} />
                </div>
                <div>
                  <Text>Success Progress</Text>
                  <Progress percent={70} status="success" />
                </div>
                <div>
                  <Text>Exception Progress</Text>
                  <Progress percent={90} status="exception" />
                </div>
                <div>
                  <Text>Circle Progress</Text>
                  <Progress type="circle" percent={75} />
                </div>
              </Space>
            </Card>

            {/* Table Section */}
            <Card title="Data Table" size="default">
              <Table
                columns={tableColumns}
                dataSource={tableData}
                pagination={{
                  total: tableData.length,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                }}
                size="middle"
              />
            </Card>
          </Space>
        </TabPane>

        <TabPane tab="Advanced" key="2">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Interactive Components */}
            <Card title="Interactive Components" size="default">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card size="small" title="Rating">
                    <Rate defaultValue={4} />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" title="Switch">
                    <Switch defaultChecked />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" title="Slider">
                    <Slider defaultValue={30} />
                  </Card>
                </Col>
              </Row>
              <Divider />
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card size="small" title="Upload">
                    <Upload>
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small" title="Search">
                    <Input.Search
                      placeholder="Search..."
                      enterButton={<SearchOutlined />}
                      size="large"
                    />
                  </Card>
                </Col>
              </Row>
            </Card>

            {/* Timeline & Steps */}
            <Card title="Timeline & Steps" size="default">
              <Row gutter={16}>
                <Col span={12}>
                  <Title level={5}>Timeline</Title>
                  <Timeline>
                    <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                    <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                    <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                    <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
                  </Timeline>
                </Col>
                <Col span={12}>
                  <Title level={5}>Steps</Title>
                  <Steps current={1} direction="vertical" size="small">
                    <Step title="Finished" description="This is a description." />
                    <Step title="In Progress" description="This is a description." />
                    <Step title="Waiting" description="This is a description." />
                  </Steps>
                </Col>
              </Row>
            </Card>

            {/* Collapsible Content */}
            <Card title="Collapsible Content" size="default">
              <Collapse defaultActiveKey={['1']}>
                <Panel header="This is panel header 1" key="1">
                  <p>This is panel content 1. You can add any content here.</p>
                </Panel>
                <Panel header="This is panel header 2" key="2">
                  <p>This is panel content 2. You can add any content here.</p>
                </Panel>
                <Panel header="This is panel header 3" key="3">
                  <p>This is panel content 3. You can add any content here.</p>
                </Panel>
              </Collapse>
            </Card>
          </Space>
        </TabPane>

        <TabPane tab="Feedback" key="3">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Alerts */}
            <Card title="Alerts & Messages" size="default">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Alert
                  message="Success Alert"
                  description="This is a success alert with description."
                  type="success"
                  showIcon
                  closable
                />
                <Alert
                  message="Info Alert"
                  description="This is an info alert with description."
                  type="info"
                  showIcon
                  closable
                />
                <Alert
                  message="Warning Alert"
                  description="This is a warning alert with description."
                  type="warning"
                  showIcon
                  closable
                />
                <Alert
                  message="Error Alert"
                  description="This is an error alert with description."
                  type="error"
                  showIcon
                  closable
                />
              </Space>
              <Divider />
              <Space wrap>
                <Button onClick={() => message.success('Success message!')}>
                  Success Message
                </Button>
                <Button onClick={() => message.info('Info message!')}>
                  Info Message
                </Button>
                <Button onClick={() => message.warning('Warning message!')}>
                  Warning Message
                </Button>
                <Button onClick={() => message.error('Error message!')}>
                  Error Message
                </Button>
              </Space>
              <Divider />
              <Space wrap>
                <Button onClick={() => showNotification('success')}>
                  Success Notification
                </Button>
                <Button onClick={() => showNotification('info')}>
                  Info Notification
                </Button>
                <Button onClick={() => showNotification('warning')}>
                  Warning Notification
                </Button>
                <Button onClick={() => showNotification('error')}>
                  Error Notification
                </Button>
              </Space>
            </Card>

            {/* Modals & Drawers */}
            <Card title="Modals & Drawers" size="default">
              <Space wrap>
                <Button type="primary" onClick={showModal}>
                  Open Modal
                </Button>
                <Button onClick={showDrawer}>
                  Open Drawer
                </Button>
              </Space>
            </Card>

            {/* Loading States */}
            <Card title="Loading States" size="default">
              <Row gutter={16}>
                <Col span={8}>
                  <Card size="small">
                    <Skeleton active />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small">
                    <Spin size="large" />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small">
                    <Empty description="No Data" />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Space>
        </TabPane>
      </Tabs>

      {/* Modal */}
      <Modal
        title="Sample Modal"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="OK"
        cancelText="Cancel"
      >
        <p>This is a sample modal content. You can add any content here.</p>
        <p>Modals are used for focused tasks and important information.</p>
      </Modal>

      {/* Drawer */}
      <Drawer
        title="Sample Drawer"
        placement="right"
        onClose={handleDrawerClose}
        open={isDrawerVisible}
        width={400}
      >
        <p>This is a sample drawer content. You can add any content here.</p>
        <p>Drawers are great for forms, detailed views, and secondary content.</p>
        <List
          dataSource={['Item 1', 'Item 2', 'Item 3']}
          renderItem={item => <List.Item>{item}</List.Item>}
        />
      </Drawer>
    </div>
  );
}; 