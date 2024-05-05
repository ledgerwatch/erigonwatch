import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CreateSessionPopup } from '../src/stories/createSessionPopup/createSessionPopup';
import { ProcessPage } from '../src/stories/process/ProcessPage';
import React from 'react';
import '@testing-library/jest-dom'

describe('App', () => {
  it('renders headline', () => {
    const handleClose = vi.fn()
    const handleCreate = vi.fn()
    
    render(<CreateSessionPopup onClose={handleClose} onCreate={handleCreate}/>);

    let elements  = screen.getAllByText('Create Session');
    expect(elements.length).toBe(1);


    let input = screen.getByPlaceholderText('Enter Session Name');
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input).toHaveValue('test');

    let button = screen.getByText('Create');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    
    expect(handleCreate).toHaveBeenCalledTimes(1)
    //screen.debug();

    // check if App components renders headline
  });
});