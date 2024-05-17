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