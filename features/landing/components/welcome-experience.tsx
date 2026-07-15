"use client";

import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import { Gift, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Flex, Stack, Cluster } from "@/components/layout";
import { Text } from "@/components/typography";
import { ROUTES } from "@/lib/constants";
import { durations, easings } from "@/lib/design-system/motion";
import { heroReveal } from "@/animations/hero";

interface WelcomeExperienceProps {
  reduceMotion?: boolean;
}

export function WelcomeExperience({ reduceMotion = false }: WelcomeExperienceProps) {
  const router = useRouter();

  return (
    <m.div
      className="relative z-10 flex min-h-dvh w-full items-center justify-center px-6 py-12 md:px-10"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: durations.reveal, ease: easings.outExpo }}
    >
      <m.div
        {...(reduceMotion
          ? {}
          : {
              variants: heroReveal.container,
              initial: "hidden" as const,
              animate: "visible" as const,
            })}
        className="w-full max-w-2xl"
      >
        <Stack gap="xl" align="start">
          <Stack gap="md" align="start" className="w-full">
            <m.div {...(reduceMotion ? {} : { variants: heroReveal.item })}>
              <Text variant="display" gradient="blue" className="tracking-tight">
                Welcome.
              </Text>
            </m.div>

            <m.div {...(reduceMotion ? {} : { variants: heroReveal.item })}>
              <Text variant="subtitle" className="max-w-xl text-pretty">
                You&apos;re about to experience
                <br />
                the Magnus HR Challenge.
              </Text>
            </m.div>
          </Stack>

          <m.div {...(reduceMotion ? {} : { variants: heroReveal.item })}>
            <Stack gap="md" className="max-w-xl">
              <Text variant="lead" className="text-pretty text-foreground/90">
                Over the next 90 seconds, you&apos;ll make a series of real HR
                decisions.
              </Text>
              <Text variant="lead" className="text-pretty text-foreground/90">
                Those decisions will reveal your Magnus HR Signature™.
              </Text>
              <Text variant="body" className="text-pretty text-muted-foreground">
                This isn&apos;t a test.
                <br />
                There are no wrong answers.
                <br />
                Only insights.
              </Text>
            </Stack>
          </m.div>

          <m.div
            {...(reduceMotion ? {} : { variants: heroReveal.item })}
            className="w-full"
          >
            <Stack gap="lg" align="start" className="w-full">
              <Button
                size="xl"
                className="min-w-[14rem]"
                motionDisabled={reduceMotion}
                onClick={() => router.push(ROUTES.register)}
              >
                Begin Challenge
              </Button>

              <Cluster gap="lg" className="text-muted-foreground">
                <Flex gap="sm" align="center">
                  <Timer className="size-4 text-blue-300" aria-hidden />
                  <Text as="span" variant="caption">
                    Approx. 90 Seconds
                  </Text>
                </Flex>
                <Flex gap="sm" align="center">
                  <Gift className="size-4 text-achievement" aria-hidden />
                  <Text as="span" variant="caption">
                    Guaranteed Reward
                  </Text>
                </Flex>
              </Cluster>
            </Stack>
          </m.div>
        </Stack>
      </m.div>
    </m.div>
  );
}
