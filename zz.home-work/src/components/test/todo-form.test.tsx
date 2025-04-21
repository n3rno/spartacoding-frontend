import { render, fireEvent, act } from '@testing-library/react';
import { TodoForm } from '../todo-form';

describe('todo form test', () => {
  let todoFormText: HTMLElement;
  let todoFormDeadline: HTMLElement;
  let todoFormButton: HTMLElement;

  beforeEach(() => {
    renderTodoForm();
  });

  const renderTodoForm = () => {
    const AppRenderResult = render(<TodoForm todos={[]} setTodos={vi.fn()} />);
    const { getByTestId } = AppRenderResult;

    todoFormText = getByTestId('todo-form-text');
    todoFormDeadline = getByTestId('todo-form-deadline');
    todoFormButton = getByTestId('todo-form-button');
  };

  it('New Todo와 Deadline 입력하면 ADD 버튼이 활성화된다.', () => {
    // WHEN
    fireEvent.change(todoFormText, { target: { value: '파운드 자르기' } });
    fireEvent.change(todoFormDeadline, { target: { value: '2025-04-14' } });

    // THEN
    expect(todoFormButton).toBeEnabled();
  });

  it('New Todo만 입력 시 ADD 버튼이 비활성화되고 있다.', () => {
    // WHEN
    fireEvent.change(todoFormText, { target: { value: '파운드 자르기' } });

    // THEN
    expect(todoFormButton).toBeDisabled();
  });

  it('활성화된 ADD 버튼 클릭 시 input 필드들이 초기화된다.', () => {
    fireEvent.change(todoFormText, { target: { value: '파운드 접시에 담기' } });
    fireEvent.change(todoFormDeadline, { target: { value: '2025-04-14' } });

    act(() => {
      fireEvent.click(todoFormButton);
    });

    expect(todoFormText).toHaveValue('');
    expect(todoFormDeadline).toHaveValue('');
  });

  it('New Todo의 maxlength가 99자이다.', () => {
    fireEvent.change(todoFormText, {
      target: {
        value:
          '파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기',
      },
    });
    act(() => {
      fireEvent.focus(todoFormText);
    });
    expect(todoFormText).toHaveValue(
      '파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담'
    );
  });
});
