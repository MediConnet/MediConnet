import { Avatar, type AvatarProps } from "@mui/material";

interface CustomAvatarProps extends Omit<AvatarProps, "src"> {
  name: string;
  src?: string | null;
  size?: number;
}

export const CustomAvatar = ({
  name,
  src,
  size = 40,
  sx,
  ...props
}: CustomAvatarProps) => {
  const getInitials = (fullName: string) => {
    return fullName
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const hasValidImage =
    src && src.trim() !== "" && !src.includes("ui-avatars.com");

  return (
    <Avatar
      src={hasValidImage ? src : undefined}
      alt={name}
      sx={{
        width: size,
        height: size,
        fontSize: size * 0.45,
        fontWeight: "bold",
        bgcolor: "#ccfbf1",
        color: "#0d9488",
        ...sx,
      }}
      {...props}
    >
      {/* Si no hay imagen válida, renderizamos las iniciales como hijos */}
      {!hasValidImage && getInitials(name)}
    </Avatar>
  );
};
