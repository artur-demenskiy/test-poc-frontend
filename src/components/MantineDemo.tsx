import React from 'react';
import {
  Button,
  Card,
  Text,
  Group,
  TextInput,
  PasswordInput,
  Stack,
  Title,
  Container,
  Grid,
  Badge,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { IconHeart, IconStar, IconSettings } from '@tabler/icons-react';

export const MantineDemo: React.FC = () => {
  return (
    <Container size="lg" py="xl">
      <Title order={1} ta="center" mb="xl">
        Mantine UI Demo
      </Title>

      {/* Buttons Demo */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
        <Title order={3} mb="md">
          Buttons
        </Title>
        <Text size="sm" c="dimmed" mb="md">
          Different button variants and colors
        </Text>
        <Group gap="sm">
          <Button variant="filled">Filled</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="light">Light</Button>
          <Button variant="white">White</Button>
          <Button variant="default">Default</Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="gradient">Gradient</Button>
        </Group>
      </Card>

      {/* Form Demo */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
        <Title order={3} mb="md">
          Form Elements
        </Title>
        <Text size="sm" c="dimmed" mb="md">
          Input fields and form components
        </Text>
        <Stack gap="md" style={{ maxWidth: 400 }}>
          <TextInput
            label="Email"
            placeholder="Enter your email"
            required
          />
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            required
          />
          <Button fullWidth>Submit</Button>
        </Stack>
      </Card>

      {/* Cards Grid Demo */}
      <Title order={3} mb="md">
        Feature Cards
      </Title>
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Title order={4}>Feature 1</Title>
              <ActionIcon variant="light" color="blue" size="sm">
                <IconStar size="1rem" />
              </ActionIcon>
            </Group>
            <Text size="sm" c="dimmed" mb="md">
              Description of the first feature
            </Text>
            <Group gap="xs">
              <Badge variant="light" color="blue">
                New
              </Badge>
              <Badge variant="light" color="green">
                Popular
              </Badge>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Title order={4}>Feature 2</Title>
              <ActionIcon variant="light" color="red" size="sm">
                <IconHeart size="1rem" />
              </ActionIcon>
            </Group>
            <Text size="sm" c="dimmed" mb="md">
              Description of the second feature
            </Text>
            <Group gap="xs">
              <Badge variant="light" color="orange">
                Hot
              </Badge>
              <Badge variant="light" color="purple">
                Featured
              </Badge>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Title order={4}>Feature 3</Title>
              <Tooltip label="Settings">
                <ActionIcon variant="light" color="gray" size="sm">
                  <IconSettings size="1rem" />
                </ActionIcon>
              </Tooltip>
            </Group>
            <Text size="sm" c="dimmed" mb="md">
              Description of the third feature
            </Text>
            <Group gap="xs">
              <Badge variant="light" color="teal">
                Stable
              </Badge>
              <Badge variant="light" color="indigo">
                Pro
              </Badge>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}; 