'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Task, TaskType, TaskCategory, User } from '@/types';
import { cn } from '@/lib/utils';

const taskSchema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  quantity: z.coerce.number().optional(),
  unit: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Task, 'id' | 'created_at'>) => void;
  categories: TaskCategory[];
  familyMembers: User[];
  currentUser: User;
  selectedFamilyId: string;
  editingTask?: Task | null;
}

const units = ['шт', 'кг', 'г', 'л', 'мл', 'уп'];

export function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  categories,
  familyMembers,
  currentUser,
  selectedFamilyId,
  editingTask,
}: TaskFormProps) {
  const [selectedType, setSelectedType] = useState<TaskType>(
    editingTask?.type || 'shopping'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    editingTask?.category_id || ''
  );
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(
    editingTask?.assigned_to || []
  );
  const [selectedUnit, setSelectedUnit] = useState<string>(
    editingTask?.unit || 'шт'
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: editingTask?.title || '',
      description: editingTask?.description || '',
      quantity: editingTask?.quantity || undefined,
      unit: editingTask?.unit || '',
    },
  });

  const filteredCategories = categories.filter((c) => c.type === selectedType);

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit({
      family_id: selectedFamilyId,
      created_by: currentUser.id,
      type: selectedType,
      category_id: selectedType !== 'other' ? selectedCategory || null : null,
      title: data.title,
      description: data.description || null,
      quantity: selectedType === 'shopping' ? data.quantity || 1 : null,
      unit: selectedType === 'shopping' ? selectedUnit || 'шт' : null,
      assigned_to: selectedAssignees,
      status: 'active',
      category: categories.find((c) => c.id === selectedCategory),
      creator: currentUser,
      assignedUsers: familyMembers.filter((m) => selectedAssignees.includes(m.id)),
    });
    reset();
    setSelectedCategory('');
    setSelectedAssignees([]);
    setSelectedUnit('шт');
    onClose();
  };

  const toggleAssignee = (userId: string) => {
    setSelectedAssignees((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleTypeChange = (type: TaskType) => {
    setSelectedType(type);
    setSelectedCategory('');
  };

  const handleCreate = () => {
    handleSubmit(handleFormSubmit)();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bottom-sheet-safe">
        <DialogHeader>
          <DialogTitle className="text-left text-lg">
            {editingTask ? 'Редактировать' : 'Новая задача'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pb-2">
          {/* Task Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Тип</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['shopping', 'home', 'other'] as TaskType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeChange(type)}
                  className={cn(
                    'py-3 px-3 rounded-xl text-sm font-medium transition-all touch-active',
                    selectedType === type
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                  )}
                >
                  {type === 'shopping' && '🛒 Покупки'}
                  {type === 'home' && '🏠 Дом'}
                  {type === 'other' && '📋 Другое'}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          {selectedType !== 'other' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Категория</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Выберите..." />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="text-base">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              {selectedType === 'shopping' ? 'Продукт' : 'Задача'}
            </Label>
            <Input
              id="title"
              {...register('title')}
              placeholder={
                selectedType === 'shopping'
                  ? 'Например: Молоко'
                  : 'Например: Помыть окна'
              }
              className="h-12 text-base"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Примечание</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Дополнительно..."
              rows={2}
              className="text-base resize-none"
            />
          </div>

          {/* Quantity & Unit */}
          {selectedType === 'shopping' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Количество</Label>
                <Input
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  {...register('quantity')}
                  placeholder="1"
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Единица</Label>
                <Select 
                  value={selectedUnit}
                  onValueChange={setSelectedUnit}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="шт" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit} className="text-base">
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Assignees */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Назначить</Label>
            <div className="flex flex-wrap gap-2">
              {familyMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => toggleAssignee(member.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-full transition-all touch-active',
                    selectedAssignees.includes(member.id)
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                  )}
                >
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={member.avatar_url || ''} />
                    <AvatarFallback className="text-xs">
                      {member.first_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{member.first_name}</span>
                </button>
              ))}
            </div>
            {familyMembers.length === 0 && (
              <p className="text-sm text-gray-400">Нет членов семьи</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 h-12 text-base"
            >
              Отмена
            </Button>
            <Button 
              type="button" 
              onClick={handleCreate} 
              className="flex-1 h-12 text-base bg-black hover:bg-gray-800"
            >
              Создать
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
