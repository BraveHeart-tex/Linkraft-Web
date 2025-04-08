import { z } from 'zod';

export const SignInSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Please provide a valid email'),
  password: z
    .string({
      required_error: 'Please provide a password',
    })
    .min(8, 'Password must be at least 8 characters long'),
});

export type SignInDto = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
  visibleName: z
    .string({
      required_error: 'Please provide a visible name',
    })
    .min(1, 'Please provide a visible name')
    .max(255, 'Visible name cannot be more than 255 characters'),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Please provide a valid email'),
  password: z
    .string({
      required_error: 'Please provide a password',
    })
    .min(8, 'Password must be at least 8 characters long'),
});

export type SignUpDto = z.infer<typeof SignUpSchema>;
