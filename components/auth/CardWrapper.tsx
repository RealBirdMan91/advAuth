import React from "react";
import { Card, CardFooter, CardHeader } from "../ui/card";
import { Header } from "./Header";
import Social from "./Social";
import { BackButton } from "./BackButton";

type CardProps = React.ComponentProps<typeof Card>;

interface CardWrapperProps extends CardProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

function CardWrapper({
  children,
  headerLabel,
  showSocial,
  backButtonHref,
  backButtonLabel,
  ...props
}: CardWrapperProps) {
  return (
    <Card className="w-[400px] shadow-md" {...props}>
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <div className="p-6">{children}</div>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton href={backButtonHref} label={backButtonLabel} />
      </CardFooter>
    </Card>
  );
}

export default CardWrapper;
