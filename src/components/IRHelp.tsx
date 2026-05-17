import type { FC } from 'react';

interface IRHelpProps {
  onClose: () => void;
}

const IRHelp: FC<IRHelpProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0f0f23] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <h2 className="text-lg font-semibold">红外遥控使用指南</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Phone IR requirement */}
        <div
          className="p-4 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <h3 className="text-sm font-medium mb-2">📱 手机红外功能</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            手机遥控空调需要手机自带<strong style={{ color: '#ff6b35' }}>红外发射器（红外遥控）</strong>硬件。
            大多数小米、华为、荣耀手机自带红外功能。OPPO、vivo 部分高端机型也支持。
          </p>
          <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(255,107,53,0.1)' }}>
            <p className="text-xs text-[#ff6b35]">
              💡 如果不确定手机有没有红外：看手机顶部有没有一个小黑点（红外发射孔），
              或者在手机自带的"智能遥控"或"万能遥控"App里看能不能添加空调。
            </p>
          </div>
        </div>

        {/* WiFi IR Blaster option */}
        <div
          className="p-4 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <h3 className="text-sm font-medium mb-2">📡 方案二：WiFi红外转发器（推荐）</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            如果手机没有红外功能，可以购买一个<strong style={{ color: '#00d4ff' }}>WiFi 红外转发器</strong>（也叫万能遥控盒子），
            插在插座上就能通过WiFi控制空调。淘宝搜索"万能遥控盒子"或"红外转发器"，价格约30-80元。
          </p>
          <p className="text-xs text-gray-500 mt-2">
            推荐型号：BroadLink RM4 Mini、小米万能遥控器、欧瑞博小方
          </p>
        </div>

        {/* How to pair */}
        <div
          className="p-4 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <h3 className="text-sm font-medium mb-2">🔧 配对步骤</h3>
          <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside leading-relaxed">
            <li>在本App中选择你的空调<strong style={{ color: '#fff' }}>品牌</strong>和类型（挂壁式/台式）</li>
            <li>确保手机顶部红外发射孔<strong style={{ color: '#fff' }}>对准空调</strong>接收窗</li>
            <li>点击遥控面板的<strong style={{ color: '#fff' }}>电源开关</strong>，测试空调是否有反应</li>
            <li>如果没反应，尝试<strong style={{ color: '#fff' }}>切换品牌</strong>（有些品牌有多个红外码库）</li>
            <li>温度、模式、风速等按钮同理，对准空调操作即可</li>
          </ol>
        </div>

        {/* Current mode info */}
        <div
          className="p-4 rounded-xl"
          style={{ background: 'rgba(144,238,144,0.05)', border: '1px solid rgba(144,238,144,0.15)' }}
        >
          <h3 className="text-sm font-medium mb-2" style={{ color: '#90ee90' }}>📋 当前模式说明</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            在浏览器中运行时，红外信号以<strong style={{ color: '#fff' }}>模拟模式</strong>工作——遥控面板功能完全可用，
            但实际红外发射需要手机硬件支持。未来发布原生APK版本后，支持红外的手机可以直接发射真实红外信号。
          </p>
        </div>
      </div>
    </div>
  );
};

export default IRHelp;
