// import React from 'react'
// import { render, screen } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
// import { Button } from './Button'

// describe('Button', () => {
//   it('renders button with default title', () => {
//     render(<Button />)
//     expect(screen.getByRole('button')).toBeInTheDocument();
//     // expect(
//     //   screen.getByRole('button', { name: /click me!/i })
//     // ).toBeInTheDocument()
//     // expect(screen.getByText(/click me!/i)).toBeInTheDocument();

//     // screen.getByRole('');
//     // screen.debug();
//     // screen.logTestingPlaygroundURL();
//   })

//   it('renders button with custom title', () => {
//     render(<Button title="A custom title" />)
//     expect(
//       screen.getByRole('button', { name: /a custom title/i })
//     ).toBeInTheDocument()
//   })

//   it('uses light mode by default', () => {
//     render(<Button />)
//     expect(screen.getByRole('button', { name: /click me!/i })).toHaveClass(
//       'light-mode'
//     )
//   })

//   it('uses dark mode when set', () => {
//     render(<Button mode="dark" />)
//     expect(screen.getByRole('button', { name: /click me!/i })).toHaveClass(
//       'dark-mode'
//     )
//   })

//   it('triggers onClick when clicked', () => {
//     const onClick = jest.fn()
//     render(<Button onClick={onClick} />)
//     userEvent.click(screen.getByRole('button', { name: /click me!/i }))
//     expect(onClick).toHaveBeenCalledTimes(1)
//   })
// })
