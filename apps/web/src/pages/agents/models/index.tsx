import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Spin,
  Switch,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import type { AgentsModel } from '@/models/agents';
import type { ModelConfig } from '../data';
import useStyles from '../style';

const { Paragraph } = Typography;

const emptyModel: ModelConfig = {
  name: '',
  provider: '',
  apiKey: '',
  baseUrl: '',
  modelName: '',
  temperature: 0.7,
  maxTokens: 2048,
  enabled: true,
};

export default function ModelsPage() {
  const { styles } = useStyles();
  const { config, loading, saving, fetchConfig, updateModels, persist } = (
    useModel as any
  )('agents') as AgentsModel;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form] = Form.useForm<ModelConfig>();

  const models = config.models;

  useEffect(() => {
    fetchConfig();
  }, []);

  const openCreate = () => {
    setEditingIndex(null);
    form.setFieldsValue(emptyModel);
    setModalOpen(true);
  };

  const openEdit = (index: number) => {
    setEditingIndex(index);
    form.setFieldsValue(models[index]);
    setModalOpen(true);
  };

  const handleDelete = (index: number) => {
    updateModels(models.filter((_, i) => i !== index));
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    const next = [...models];
    if (editingIndex !== null) {
      next[editingIndex] = values;
    } else {
      next.push(values);
    }
    updateModels(next);
    setModalOpen(false);
    // 自动保存
    setTimeout(() => persist(), 0);
  };

  const getActions = (i: number) => [
    <Button key="edit" type="link" onClick={() => openEdit(i)}>编辑</Button>,
    <Button key="delete" type="link" danger onClick={() => handleDelete(i)}>删除</Button>,
  ];

  return (
    <PageContainer
      ghost
      extra={
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={saving}
          onClick={persist}
        >
          保存
        </Button>
      }
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
              <PlusOutlined /> 新增 Model
            </Button>
          </Col>
          {models.map((item, i) => (
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
                        onChange={(checked) => {
                          const next = [...models];
                          next[i] = { ...next[i], enabled: checked };
                          updateModels(next);
                        }}
                      />
                    </span>
                  }
                  description={
                    <Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 0 }}>
                      {item.provider} · {item.modelName || '-'}
                    </Paragraph>
                  }
                />
                <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                  {item.baseUrl || '默认 Endpoint'}
                </div>
                <div style={{ marginTop: 4, fontSize: 12, color: '#999' }}>
                  温度: {item.temperature ?? 0.7} · 最大Token: {item.maxTokens ?? 2048}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>

      <Modal
        title={editingIndex !== null ? '编辑 Model' : '新增 Model'}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        width={640}
      >
        <Form form={form} layout="vertical" initialValues={emptyModel}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]} style={{ marginBottom: 12 }}>
                <Input placeholder="Model 名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="provider" label="提供商" rules={[{ required: true, message: '请输入提供商' }]} style={{ marginBottom: 12 }}>
                <Input placeholder="如 openai, anthropic, local" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="modelName" label="模型标识" style={{ marginBottom: 12 }}>
                <Input placeholder="如 gpt-4, claude-3" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="baseUrl" label="Base URL" style={{ marginBottom: 12 }}>
                <Input placeholder="https://api.openai.com/v1" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="temperature" label="温度" style={{ marginBottom: 12 }}>
                <InputNumber min={0} max={2} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="maxTokens" label="最大 Token" style={{ marginBottom: 12 }}>
                <InputNumber min={1} max={131072} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="enabled" label="启用" valuePropName="checked" style={{ marginBottom: 12 }}>
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="apiKey" label="API Key" style={{ marginBottom: 12 }}>
            <Input.Password placeholder="API Key" autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}
