import { render, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  /**
   * 2-4. Todo List 추가기능을 TDD로 구현하기
   * 신규 기능 Spec
   * 1) 할일을 입력할 때 100자 이상 작성하면 입력할 수 없다.
   * 2) 할일을 입력할 때 데드라인 날짜가 오늘 날짜 미만이면 입력할 수 없다.
   */
  it('New Todo의 maxlength가 99자이다.', async () => {
    const user = userEvent.setup();

    fireEvent.change(todoFormText, {
      target: {
        value:
          '파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 ',
      },
    });
    await act(async () => {
      await user.click(todoFormText); // focus
      await user.keyboard('e'); // 입력
    });


    expect(todoFormText).toHaveValue(
      '파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 담기파운드 접시에 e'
    );
  });

  it('데드라인에 오늘 이전 날짜를 클릭하면 오늘 날짜로 변경된다.', () => {
    fireEvent.change(todoFormDeadline, { target: { value: '2024-04-21' } });
    act(() => {
      fireEvent.click(todoFormDeadline);
      fireEvent.focus(todoFormDeadline);
      fireEvent.blur(todoFormDeadline);
    });
    const today = new Date();
    expect(todoFormDeadline).toHaveValue(
      today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    );
  });
});
