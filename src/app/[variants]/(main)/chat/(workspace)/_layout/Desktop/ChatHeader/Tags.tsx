import { ModelTag } from '@lobehub/icons';
import { Skeleton } from 'antd';
import isEqual from 'fast-deep-equal';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import ModelSwitchPanel from '@/features/ModelSwitchPanel';
import PluginTag from '@/features/PluginTag';
import { useAgentEnableSearch } from '@/hooks/useAgentEnableSearch';
import { useEnabledChatModels } from '@/hooks/useEnabledChatModels';
import { useModelSupportToolUse } from '@/hooks/useModelSupportToolUse';
import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/selectors';
import { useUserStore } from '@/store/user';
import { authSelectors } from '@/store/user/selectors';

import KnowledgeTag from './KnowledgeTag';
import SearchTags from './SearchTags';

const getModelTitleDisplayName = (enabledList: any, provider: string, model: string): string => {
  // 遍历 enabledList
  for (const item of enabledList) {
    // 找到匹配的 provider
    if (item.id === provider) {
      // 遍历 children
      for (const child of item.children) {
        // 找到匹配的 model
        if (child.id === model) {
          // 返回拼接的字符串
          return `${child.displayName} (${item.name})`;
        }
      }
    }
  }
  // 如果没有找到匹配的数据，返回默认值或提示
  return '';
};
const TitleTags = memo(() => {
  const [model, provider, hasKnowledge, isLoading] = useAgentStore((s) => [
    agentSelectors.currentAgentModel(s),
    agentSelectors.currentAgentModelProvider(s),
    agentSelectors.hasKnowledge(s),
    agentSelectors.isAgentConfigLoading(s),
  ]);

  const enabledList = useEnabledChatModels();
  const titleDisplayName = getModelTitleDisplayName(enabledList, provider, model);
  const plugins = useAgentStore(agentSelectors.currentAgentPlugins, isEqual);
  const enabledKnowledge = useAgentStore(agentSelectors.currentEnabledKnowledge, isEqual);

  const showPlugin = useModelSupportToolUse(model, provider);
  const isLogin = useUserStore(authSelectors.isLogin);

  const isAgentEnableSearch = useAgentEnableSearch();

  return isLoading && isLogin ? (
    <Skeleton.Button active size={'small'} style={{ height: 20 }} />
  ) : (
    <Flexbox align={'center'} horizontal>
      <ModelSwitchPanel>
        <ModelTag model={titleDisplayName} />
      </ModelSwitchPanel>
      {isAgentEnableSearch && <SearchTags />}
      {showPlugin && plugins?.length > 0 && <PluginTag plugins={plugins} />}
      {hasKnowledge && <KnowledgeTag data={enabledKnowledge} />}
    </Flexbox>
  );
});

export default TitleTags;
