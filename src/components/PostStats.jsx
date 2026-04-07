import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import {
  getTotalViews,
  getDailyViews,
  getDailyDurations,
} from '../api/events.js'
import {
    VictoryChart,
    VictoryTooltip,
    VictoryBar,
    VictoryLine,
    VictoryVoronoiContainer
} from 'victory'

export function PostStats({ postId }) {
  const { data: totalViews, isLoading: totalLoading } = useQuery({
    queryKey: ['totalViews', postId],
    queryFn: () => getTotalViews(postId),
  })
  const { data: dailyViews, isLoading: dailyViewsLoading } = useQuery({
    queryKey: ['dailyViews', postId],
    queryFn: () => getDailyViews(postId),
  })
  const { data: dailyDurations, isLoading: dailyDurationsLoading } = useQuery({
    queryKey: ['dailyDurations', postId],
    queryFn: () => getDailyDurations(postId),
  })

  if (totalLoading || dailyViewsLoading || dailyDurationsLoading) {
    return <div>Loading Stats...</div>
  }
  return (
    <div>
      <b>{totalViews?.views} total views</b>
      <div style={{ width: 512 }}>
        <h3>Daily Views</h3>
        <VictoryChart domainPadding={16}>
            <VictoryBar labelComponent={<VictoryTooltip />} 
            data={dailyViews.data?.map((d) => ({
                x: new Date(d._id),
                y: d.views,
                label: `${new Date(d._id).toLocaleDateString()} : ${d.views} views`
            }))}/>
        </VictoryChart>
      </div>
      <div style={{ width: 512 }}>
        <h3>Daily Durations</h3>
        <VictoryChart 
            domainPadding={16}
            containerComponent={
                <VictoryVoronoiContainer
                    voronoiDimension='x'
                    labels={({ datum }) => `${datum.x.toLocaleDateString()}: ${datum.y.toFixed(2)} minutes`}
                    labelComponent={<VictoryTooltip />}
                />
            }
        >
            <VictoryLine 
                data={dailyDurations.data?.map((d) => ({
                    x: new Date(d._id),
                    y: d.avgDuration / (60 * 1000), // convert ms to minutes
                }))}
            />
        </VictoryChart>
      </div>
    </div>
  )
}

PostStats.propTypes = {
  postId: PropTypes.string.isRequired,
}
