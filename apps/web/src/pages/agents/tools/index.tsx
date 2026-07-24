import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Spin,
  Switch,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import type { AgentsModel } from '@/models/agents';
import type { ToolConfig } from '../data';
import { saveBroclawConfig } from '../service';
import useStyles from '../style';

const { TextArea } = Input;
const { Paragraph } = Typography;

const emptyTool: ToolConfig = {
  name: '',
  description: '',
  type: 'function',
  config: {},
  enabled: true,
};

export default function ToolsPage() {
  const { styles } = useStyles();
  const { config, loading, fetchConfig, updateTools } = (
    useModel as any
  )('agents') as AgentsModel;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form] = Form.useForm<ToolConfig>();

  const tools = config.tools;

  useEffect(() => {
    fetchConfig();
  }, []);

  const openCreate = () => {
    setEditingIndex(null);
    form.setFieldsValue(emptyTool);
    setModalOpen(true);
  };

  const openEdit = (index: number) => {
    setEditingIndex(index);
    form.setFieldsValue(tools[index]);
    setModalOpen(true);
  };

  const handleDelete = async (index: number) => {
    const next = tools.filter((_, i) => i !== index);
    updateTools(next);
    await saveBroclawConfig({ ...config, tools: next });
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    const next = [...tools];
    if (editingIndex !== null) {
      next[editingIndex] = values;
    } else {
      next.push(values);
    }
    updateTools(next);
    setModalOpen(false);
    await saveBroclawConfig({ ...config, tools: next });
  };

  const getActions = (i: number) => [
    <Button key="edit" type="link" onClick={() => openEdit(i)}>编辑</Button>,
    <Button key="delete" type="link" danger onClick={() => handleDelete(i)}>删除</Button>,
  ];

  return (
    <PageContainer
      ghost
    >
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6}>
            <Button
              type="dashed"
              block
              style={{ minHeight: 240 }}
              onClick={openCreate}
            >
              <PlusOutlined /> 新增 Tool
            </Button>
          </Col>
          {tools.map((item, i) => (
            <Col key={item.name || i} xs={24} sm={12} md={8} lg={8} xl={6} xxl={6}>
              <Card
                className={styles.card}
                actions={getActions(i)}
              >
                <Card.Meta
                  title={
                    <span>
                      {item.name}
                      <Switch
                        size="small"
                        checked={item.enabled}
                        style={{ marginLeft: 8 }}
                        onChange={async (checked) => {
                          const next = [...tools];
                          next[i] = { ...next[i], enabled: checked };
                          updateTools(next);
                          await saveBroclawConfig({ ...config, tools: next });
                        }}
                      />
                    </span>
                  }
                  description={
                    <Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 0 }}>
                      {item.description || '无描述'}
                    </Paragraph>
                  }
                />
                <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                  类型: {item.type}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>

      <Modal
        title={editingIndex !== null ? '编辑 Tool' : '新增 Tool'}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        width={560}
      >
        <Form form={form} layout="vertical" initialValues={emptyTool}>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="Tool 名称" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <TextArea rows={2} placeholder="Tool 描述" />
          </Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true, message: '请输入类型' }]}>
            <Input placeholder="如 function, api, code_interpreter" />
          </Form.Item>
          <Row align="middle" style={{ marginTop: 8 }}>
            <Col flex="auto">
              <Form.Item name="enabled" label="启用" valuePropName="checked" style={{ marginBottom: 0 }}>
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  );
}
