import { ChatInputActionBar, Icon } from '@lobehub/ui';
import { Button } from 'antd';
import { EarthLock } from 'lucide-react';
import { ReactNode, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/slices/chat';

import { ActionKeys, actionMap } from './config';

const RenderActionList = ({ dataSource }: { dataSource: ActionKeys[] }) => (
  <>
    {dataSource.map((key) => {
      const Render = actionMap[key];
      return <Render key={key} />;
    })}
  </>
);

export interface ActionBarProps {
  leftActions: ActionKeys[];
  leftAreaEndRender?: ReactNode;
  leftAreaStartRender?: ReactNode;
  padding?: number | string;
  rightActions: ActionKeys[];
  rightAreaEndRender?: ReactNode;
  rightAreaStartRender?: ReactNode;
}

const ActionBar = memo<ActionBarProps>(
  ({
    padding = '0 16px',
    rightAreaStartRender,
    rightAreaEndRender,
    leftAreaStartRender,
    leftAreaEndRender,
    leftActions,
    rightActions,
  }) => {
    const { t } = useTranslation('chat');
    const [model, provider] = useAgentStore((s) => [
      agentSelectors.currentAgentModel(s),
      agentSelectors.currentAgentModelProvider(s),
    ]);
    // 状态管理 localStorage 的 searchEnabled 值
    const [searchEnabled, setSearchEnabled] = useState(0);
    // 在 useEffect 中初始化 searchEnabled
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const storedValue = localStorage.getItem('searchEnabled');
        setSearchEnabled(storedValue ? parseInt(storedValue, 10) : 0);
      }
    }, []);
    // 点击联网搜索
    const changeSearchEnabled = () => {
      const newEnabled = searchEnabled === 1 ? 0 : 1;
      setSearchEnabled(newEnabled);
      if (typeof window !== 'undefined') {
        localStorage.setItem('searchEnabled', newEnabled.toString());
      }
    };
    console.log('provider', provider);
    // 只有 provider === 'qwen' 时，才渲染 Button
    const showButton =
      (provider === 'qwen' && model === 'deepseek-r1') ||
      (provider === 'qwen' && model === 'deepseek-v3');
    return (
      <ChatInputActionBar
        leftAddons={
          <>
            {leftAreaStartRender}
            <RenderActionList dataSource={leftActions} />
            {leftAreaEndRender}
            {showButton && ( // 条件渲染 Button
              <Button
                icon={<Icon icon={EarthLock} />}
                onClick={() => changeSearchEnabled()}
                size="small"
                type={searchEnabled === 1 ? 'primary' : 'default'}
              >
                {t('searchEnabled')}
              </Button>
            )}
          </>
        }
        padding={padding}
        rightAddons={
          <>
            {rightAreaStartRender}
            <RenderActionList dataSource={rightActions} />
            {rightAreaEndRender}
          </>
        }
      />
    );
  },
);

export default ActionBar;
