import React from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Heading,
  Text,
  Stack,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Badge,
  IconButton,
  Tooltip,
  VStack,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, StarIcon, HeartIcon, SettingsIcon } from '@chakra-ui/icons';

export const ChakraDemo: React.FC = () => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <Heading as="h1" size="2xl" textAlign="center" mb={8}>
        Chakra UI Demo
      </Heading>

      {/* Buttons Demo */}
      <Card bg={bgColor} borderColor={borderColor} mb={8}>
        <CardHeader>
          <Heading size="md">Buttons</Heading>
          <Text color="gray.500">Different button variants and colors</Text>
        </CardHeader>
        <CardBody>
          <HStack spacing={4} flexWrap="wrap">
            <Button colorScheme="blue">Primary</Button>
            <Button colorScheme="teal" variant="outline">
              Outline
            </Button>
            <Button colorScheme="green" variant="ghost">
              Ghost
            </Button>
            <Button colorScheme="purple" variant="solid">
              Solid
            </Button>
            <Button colorScheme="orange" variant="link">
              Link
            </Button>
            <Button colorScheme="red" size="sm">
              Small
            </Button>
            <Button colorScheme="blue" size="lg">
              Large
            </Button>
          </HStack>
        </CardBody>
      </Card>

      {/* Form Demo */}
      <Card bg={bgColor} borderColor={borderColor} mb={8}>
        <CardHeader>
          <Heading size="md">Form Elements</Heading>
          <Text color="gray.500">Input fields and form components</Text>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} maxW="400px">
            <Input placeholder="Enter your email" type="email" />
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type={show ? 'text' : 'password'}
                placeholder="Enter password"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Button colorScheme="blue" width="100%">
              Submit
            </Button>
          </VStack>
        </CardBody>
      </Card>

      {/* Cards Grid Demo */}
      <Box>
        <Heading size="md" mb={4}>
          Feature Cards
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <Card bg={bgColor} borderColor={borderColor}>
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="sm">Feature 1</Heading>
                <Tooltip label="Favorite">
                  <IconButton
                    aria-label="Favorite"
                    icon={<StarIcon />}
                    size="sm"
                    colorScheme="yellow"
                    variant="ghost"
                  />
                </Tooltip>
              </HStack>
            </CardHeader>
            <CardBody>
              <Text fontSize="sm" color="gray.500" mb={3}>
                Description of the first feature
              </Text>
              <HStack spacing={2}>
                <Badge colorScheme="blue">New</Badge>
                <Badge colorScheme="green">Popular</Badge>
              </HStack>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="sm">Feature 2</Heading>
                <Tooltip label="Like">
                  <IconButton
                    aria-label="Like"
                    icon={<HeartIcon />}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                  />
                </Tooltip>
              </HStack>
            </CardHeader>
            <CardBody>
              <Text fontSize="sm" color="gray.500" mb={3}>
                Description of the second feature
              </Text>
              <HStack spacing={2}>
                <Badge colorScheme="orange">Hot</Badge>
                <Badge colorScheme="purple">Featured</Badge>
              </HStack>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderColor={borderColor}>
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="sm">Feature 3</Heading>
                <Tooltip label="Settings">
                  <IconButton
                    aria-label="Settings"
                    icon={<SettingsIcon />}
                    size="sm"
                    colorScheme="gray"
                    variant="ghost"
                  />
                </Tooltip>
              </HStack>
            </CardHeader>
            <CardBody>
              <Text fontSize="sm" color="gray.500" mb={3}>
                Description of the third feature
              </Text>
              <HStack spacing={2}>
                <Badge colorScheme="teal">Stable</Badge>
                <Badge colorScheme="indigo">Pro</Badge>
              </HStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>
    </Box>
  );
}; 