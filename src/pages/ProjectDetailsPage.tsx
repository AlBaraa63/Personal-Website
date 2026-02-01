import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import GameProjectDetail from '@/components/features/projects/GameProjectDetail';
import { projects } from '@/data/portfolioData';

type MediaItem = { type: 'image' | 'video' | 'gif'; src: string; alt?: string };

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);

  if (!project) return <Navigate to="/" replace />;

  // Derive basic props from existing data; can be customized per project later.
  const bossFights = (project.challenges ?? []).map((challenge, i) => ({
    challenge,
    solution: project.solutions?.[i] ?? 'WIP: Solution details coming soon'
  }));

  const timeline = (project.challenges ?? []).map((note, i) => ({
    level: `Level ${i + 1}`,
    note
  }));

  // Custom media arrays for projects with multiple images
  const getProjectMedia = (projectId: string): MediaItem[] | undefined => {
    // First, check if project has visuals defined
    if (project.visuals && project.visuals.length > 0) {
      return project.visuals.map(visual => ({
        type: 'image' as const,
        src: visual.src,
        alt: visual.alt
      }));
    }

    // Fallback to custom media arrays for specific projects
    switch (projectId) {
      case 'color-detection':
        return [
          { type: 'image' as const, src: '/assets/images/color-detection/cover.png', alt: 'Color Detection System' },
          { type: 'image' as const, src: '/assets/images/color-detection/hsv-conversion.jpg', alt: 'HSV Color Space Conversion' },
          { type: 'image' as const, src: '/assets/images/color-detection/mask-output.png', alt: 'Binary Mask Output' }
        ];
      default:
        return undefined;
    }
  };

  const media = getProjectMedia(project.id);

  return (
    <Layout>
      <GameProjectDetail
        project={project}
        media={media}
        bossFights={bossFights}
        timeline={timeline}
      />
    </Layout>
  );
};

export default ProjectDetailsPage;
