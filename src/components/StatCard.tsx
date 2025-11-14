import Icon from './Icon'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: string
}

export default function StatCard({ title, value, change, changeType = 'neutral', icon }: StatCardProps) {
  const changeColor = {
    positive: 'text-[#50E3C2]',
    negative: 'text-[#F5A623]',
    neutral: 'text-gray-400',
  }[changeType]

  const changeIcon = {
    positive: 'arrow_upward',
    negative: 'arrow_downward',
    neutral: 'remove',
  }[changeType]

  return (
    <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#324d67] bg-[#0c141b]">
      <div className="flex items-center justify-between">
        <p className="text-white/80 text-base font-medium leading-normal">{title}</p>
        {icon && <Icon name={icon} className="text-primary" />}
      </div>
      <p className="text-white tracking-light text-3xl font-bold leading-tight">{value}</p>
      {change && (
        <p className={`${changeColor} text-base font-medium leading-normal flex items-center gap-1`}>
          <Icon name={changeIcon} className="text-lg" />
          {change}
        </p>
      )}
    </div>
  )
}

