"use client";

import { AnimateText, AnimatedText } from "@/components/motion/TextEffects";
import { Project } from "@/lib/fetchData";
import { CMSContext } from "@/lib/state";
import { cn } from "@/lib/utils";
import { urlForImage } from "@/sanity/lib/image";
import { Badge } from "@radix-ui/themes";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { debounce } from "lodash";
import { Github } from "lucide-react";
import Image from "next/image";
import {
    ComponentProps,
    FC,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { useStore } from "zustand";
import { BackButton } from "../Buttons/BackButton";
import { LinkButton } from "../Buttons/LinkButton";
import Track from "../Track";

const MotionBadge = motion(Badge);
const GithubBadge = motion(Github);

export default function ProjectsCard(props: ComponentProps<typeof motion.div>) {
  const { ...rest } = props;
  const projectsRef = useRef(null);
  const textBodyControls = useAnimationControls();
  const trackControls = useAnimationControls();
  const prevFocusedProject = useRef<Project>();
  const [focusedProject, setFocusedProject] = useState<Project>();
  const [selectedProject, setSelectedProject] = useState<Project>();
  const clickedProject = useRef<number>(-1);
  const dragRef = useRef(false);
  const cms = useContext(CMSContext)!;
  const projects = useStore(cms, (cms) => cms.projects ?? []);

  const DEFAULT_TEXT = "Scroll or drag to navigate.";
  const ProjectTitle = useCallback((
    props: Omit<ComponentProps<typeof AnimatedText>, "textChild">
  ) => {
    const Title: FC<{ className?: string; text: string }> = ({
      className,
      text,
    }) => (
      <AnimateText
        size={"8"}
        className={cn(
          "w-min font-bold",
          className
        )}
        text={text}
      />
    );

    return <AnimatedText {...props} textChild={Title} />;
  }, []);

  const ProjectDescription = useCallback((
    props: Omit<ComponentProps<typeof AnimatedText>, "textChild">
  ) => {
    const Text: FC<{ className?: string; text: string }> = ({
      className,
      text,
    }) => (
      <AnimateText
        className={cn(
          "w-inherit whitespace-normal",
          className
        )}
        size={"3"}
        text={text}
      />
    );
    return <AnimatedText {...props} textChild={Text} />;
  }, []);

  const changeFocusTitle = debounce(
    (project?: Project) => {
      setFocusedProject((prevProj) => {
        prevFocusedProject.current = prevProj;
        return project;
      });
    },
    600,
    { trailing: true, leading: true, maxWait: 600 }
  );

  useEffect(() => {
    if (!selectedProject) {
      trackControls.start("deselected");
      textBodyControls.start("deselected");
      setFocusedProject(undefined);
    } else {
      trackControls.start("selected");
      textBodyControls.start("selected");
    }
  }, [selectedProject, textBodyControls, trackControls]);

  const changeSelectedProject = useCallback(
    (project?: Project) => {
      clickedProject.current = projects.findIndex(
        (p) => p.name === project?.name
      );
      setSelectedProject(project);
    },
    [projects]
  );

  const handleProjectHover = (project?: Project) => () => {
    if (focusedProject && focusedProject !== selectedProject)
      changeFocusTitle(project);
    else if (!(selectedProject && project === selectedProject))
      changeFocusTitle(project);
  };

  return (
    <motion.div
      {...rest}
      className={cn(
        "relative flex h-full flex-1 flex-col justify-start gap-2 p-4"
      )}
      ref={projectsRef}
      onHoverEnd={() =>
        setTimeout(() => handleProjectHover(selectedProject)(), 1000)
      }
    >
      <Track
        className={cn(
          "h-3/5 gap-g-2/8"
        )}
        dragRef={dragRef}
        animate={trackControls}
        clickedIndex={clickedProject}
        variants={{
          selected: {
            height: [null, "90%"],
          },
          deselected: {
            height: [null, "90%"],
          },
        }}
      >
        {projects.map((project, index) => (
          <motion.div
            key={index}
            custom={index}
            className={cn(
              "track-card group",
              "relative h-full cursor-pointer", // basicStyles, sizing, interactions
              "overflow-hidden rounded-sm p-0", // overflowControl, border, padding
              "duration-300" // transitionsAnimations
            )}
            onHoverStart={handleProjectHover(project)}
            onTap={() => changeSelectedProject(project)}
          >
            <Image
              className={cn(
                "track-img h-full w-full object-cover opacity-50 hover:opacity-75 dark:hover:opacity-100 dark:brightness-90 dark:hover:brightness-50 blur-sm group-hover:blur-none brightness-75 contrast-75 saturate-150 transition-all duration-300",
                {
                  "dark:opacity-90 blur-none brightness-125 dark:brightness-75":
                    project.name == focusedProject?.name ||
                    project.name == selectedProject?.name,
                }
              )}
              src={urlForImage(project.thumbnails[0])}
              draggable={false}
              alt="project image"
              width={500}
              height={400}
            />
          </motion.div>
        ))}
      </Track>
      <motion.div
        key={"body"}
        animate={textBodyControls}
        className={cn(
          "absolute top-1/2 left-0 flex h-1/2 flex-col px-12",
          props.className
        )}
      >
        <motion.div className="flex justify-between gap-2 pr-4">
          <ProjectTitle
            text={focusedProject?.name || selectedProject?.name || "Projects."}
            reverse={!focusedProject}
          />
          <AnimatePresence>
            {selectedProject && (
              <div className="flex items-center gap-4">
                {selectedProject.link && (
                  <LinkButton
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    href={selectedProject.link}
                  />
                )}
                {selectedProject.githublink && (
                  <LinkButton
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    ComponentA={(props) => <GithubBadge {...props} />}
                    href={selectedProject.githublink}
                  />
                )}
                <BackButton
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  onClick={() => changeSelectedProject()}
                />
              </div>
            )}
          </AnimatePresence>
        </motion.div>
        <ProjectDescription
          text={selectedProject?.description ?? DEFAULT_TEXT}
          reverse={!selectedProject}
        />
        <div className="flex gap-2 p-4">
          <AnimatePresence mode="wait">
            {selectedProject &&
              selectedProject.stack.map((tech) => {
                return (
                  <MotionBadge
                    id={tech.name}
                    variant="surface"
                    key={tech.name}
                    color="gray"
                    animate={{
                      opacity: [0, 1],
                      y: [20, 0],
                      transition: {
                        delay: 0.3,
                      },
                    }}
                    exit={{
                      opacity: 0,
                      y: 20,
                    }}
                  >
                    {tech.name}
                  </MotionBadge>
                );
              })}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
