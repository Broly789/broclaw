import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
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
  Select,
  Spin,
  Switch,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import type { AgentConfig } from '../data';
import type { AgentsModel } from '@/models/agents';
import useStyles from '../style';

const { TextArea } = Input;
const { Paragraph } = Typography;

const emptyAgent: AgentConfig = {
  name: '',
  description: '',
  model: '',
  systemPrompt: '',
  tools: [],
  enabled: true,
};

export default function AgentsPage() {
  const { styles } = useStyles();
  const { config, loading, saving, fetchConfig, updateAgents, persist } = (
    useModel as any
  )('agents') as AgentsModel;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form] = Form.useForm<AgentConfig>();
  const [formWarnings, setFormWarnings] = useState<string[]>([]);

  const agents = config.agents;
  const models = config.models.filter(m => m.enabled);
  const tools = config.tools.filter(t => t.enabled);

  useEffect(() => {
    if (config.agents.length === 0 && config.models.length === 0 && config.tools.length === 0) {
      fetchConfig();
    }
  }, []);

  const openCreate = () => {
    setEditingIndex(null);
    setFormWarnings([]);
    form.setFieldsValue(emptyAgent);
    setModalOpen(true);
  };

  const openEdit = (index: number) => {
    const agent = agents[index];
    // 检测无效绑定 - model字段绑定的是modelName（模型ID），不是name（显示名）
    const matchedModel = models.find(m => m.modelName === agent.model);
    const invalidModel = agent.model && !matchedModel;
    const invalidTools = agent.tools?.filter(tool => !tools.some(t => t.name === tool)) || [];
    
    // 清理无效绑定
    const cleanAgent = {
      ...agent,
      model: invalidModel ? undefined : agent.model,
      tools: agent.tools?.filter(tool => tools.some(t => t.name === tool)),
    };
    
    // 收集警告信息 - 显示名用name，不是modelName
    const warnings = [];
    if (invalidModel) warnings.push(`模型 "${agent.model}" 已禁用`);
    if (invalidTools.length > 0) warnings.push(`工具 "${invalidTools.join('", "')}" 已禁用`);
    setFormWarnings(warnings);
    
    setEditingIndex(index);
    form.setFieldsValue(cleanAgent);
    setModalOpen(true);
  };

  const handleDelete = (index: number) => {
    updateAgents(agents.filter((_, i) => i !== index));
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    const next = [...agents];
    if (editingIndex !== null) {
      next[editingIndex] = values;
    } else {
      next.push(values);
    }
    updateAgents(next);
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
              <PlusOutlined /> 新增 Agent
            </Button>
          </Col>
          {agents.map((item, i) => (
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
                          const next = [...agents];
                          next[i] = { ...next[i], enabled: checked };
                          updateAgents(next);
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
                  模型: {item.model || '-'}
                </div>
                {item.tools && item.tools.length > 0 && (
                  <div style={{ marginTop: 4, fontSize: 12, color: '#999' }}>
                    工具: {item.tools.join(', ')}
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>

      <Modal
        title={editingIndex !== null ? '编辑 Agent' : '新增 Agent'}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => { setModalOpen(false); setFormWarnings([]); }}
        width={560}
      >
        <Form form={form} layout="vertical" initialValues={emptyAgent}>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="Agent 名称" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <TextArea rows={2} placeholder="Agent 描述" />
          </Form.Item>
          <Form.Item 
            name="model" 
            label="绑定模型"
            help={formWarnings.length > 0 && formWarnings.some(w => w.includes('模型')) ? (
              <span style={{ color: '#ff4d4f' }}>{formWarnings.find(w => w.includes('模型'))}</span>
            ) : undefined}
            validateStatus={formWarnings.some(w => w.includes('模型')) ? 'error' : undefined}
          >
            <Select
              placeholder="选择模型"
              options={models.map(m => ({ label: m.name, value: m.modelName }))}
              onChange={(value) => {
                if (value && models.some(m => m.modelName === value)) {
                  setFormWarnings(prev => prev.filter(w => !w.includes('模型')));
                }
              }}
            />
          </Form.Item>
          <Form.Item name="systemPrompt" label="系统提示词">
            <TextArea rows={3} placeholder="System Prompt" />
          </Form.Item>
          <Form.Item 
            name="tools" 
            label="绑定工具"
            help={formWarnings.length > 0 && formWarnings.some(w => w.includes('工具')) ? (
              <span style={{ color: '#ff4d4f' }}>{formWarnings.find(w => w.includes('工具'))}</span>
            ) : undefined}
            validateStatus={formWarnings.some(w => w.includes('工具')) ? 'error' : undefined}
          >
            <Select
              mode="multiple"
              placeholder="选择工具"
              options={tools.map(t => ({ label: t.name, value: t.name }))}
              onChange={(values: string[]) => {
                if (values?.length > 0) {
                  const invalidSelected = values.filter((v: string) => !tools.some(t => t.name === v));
                  if (invalidSelected.length === 0) {
                    setFormWarnings(prev => prev.filter(w => !w.includes('工具')));
                  }
                } else {
                  setFormWarnings(prev => prev.filter(w => !w.includes('工具')));
                }
              }}
            />
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
