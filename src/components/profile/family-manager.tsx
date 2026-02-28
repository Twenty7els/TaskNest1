'use client';

import { useState } from 'react';
import { Users, Plus, Crown, UserMinus, LogOut, X } from 'lucide-react';
import { FamilyGroup, User as UserType } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface FamilyManagerProps {
  isOpen: boolean;
  onClose: () => void;
  families: FamilyGroup[];
  currentUserId: string;
  friends: UserType[];
  selectedFamilyId: string | null;
  onCreateFamily: (name: string) => void;
  onInviteToFamily: (familyId: string, userId: string) => void;
  onLeaveFamily: (familyId: string) => void;
  onRemoveMember?: (familyId: string, userId: string) => void;
  onSelectFamily: (familyId: string) => void;
}

export function FamilyManager({
  isOpen,
  onClose,
  families,
  currentUserId,
  friends,
  selectedFamilyId,
  onCreateFamily,
  onInviteToFamily,
  onLeaveFamily,
  onRemoveMember,
  onSelectFamily,
}: FamilyManagerProps) {
  const [newFamilyName, setNewFamilyName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [inviteFamilyId, setInviteFamilyId] = useState<string | null>(null);

  const handleCreateFamily = () => {
    if (newFamilyName.trim()) {
      onCreateFamily(newFamilyName.trim());
      setNewFamilyName('');
      setShowCreateForm(false);
    }
  };

  const getAvailableFriends = (familyId: string) => {
    const family = families.find((f) => f.id === familyId);
    const memberIds = family?.members?.map((m) => m.user_id) || [];
    return friends.filter((f) => !memberIds.includes(f.id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Управление семьями
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Create Family */}
          {showCreateForm ? (
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <Input
                placeholder="Название семьи..."
                value={newFamilyName}
                onChange={(e) => setNewFamilyName(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewFamilyName('');
                  }}
                  className="flex-1"
                >
                  Отмена
                </Button>
                <Button onClick={handleCreateFamily} className="flex-1">
                  Создать
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Создать семью
            </Button>
          )}

          {/* Families List */}
          <div className="space-y-3">
            {families.map((family) => {
              const isSelected = family.id === selectedFamilyId;
              const isAdmin = family.members?.some(
                (m) => m.user_id === currentUserId && m.role === 'admin'
              );
              const availableFriends = getAvailableFriends(family.id);

              return (
                <div
                  key={family.id}
                  className={cn(
                    'rounded-xl border overflow-hidden',
                    isSelected ? 'border-blue-300 bg-blue-50/30' : 'border-gray-100 bg-white'
                  )}
                >
                  {/* Family Header */}
                  <button
                    onClick={() => onSelectFamily(family.id)}
                    className="w-full p-4 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center',
                          isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
                        )}
                      >
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{family.name}</p>
                        <p className="text-sm text-gray-500">
                          {family.members?.length || 0} участников
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <Badge className="bg-blue-500">Активна</Badge>
                    )}
                  </button>

                  {/* Members */}
                  {family.members && family.members.length > 0 && (
                    <div className="px-4 pb-2">
                      <div className="space-y-1">
                        {family.members.map((member) => {
                          const isCurrentUser = member.user_id === currentUserId;
                          const canRemove = isAdmin && !isCurrentUser && onRemoveMember;
                          
                          return (
                            <div
                              key={member.id}
                              className="flex items-center justify-between bg-gray-50 rounded-full px-2 py-1"
                            >
                              <div className="flex items-center gap-1.5">
                                <Avatar className="w-5 h-5">
                                  <AvatarImage src={member.user?.avatar_url || ''} />
                                  <AvatarFallback className="text-xs">
                                    {member.user?.first_name?.[0] || '?'}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-gray-600">
                                  {member.user?.first_name}
                                </span>
                                {member.role === 'admin' && (
                                  <Crown className="w-3 h-3 text-yellow-500" />
                                )}
                              </div>
                              
                              {/* Remove member button */}
                              {canRemove && (
                                <button
                                  onClick={() => onRemoveMember(family.id, member.user_id)}
                                  className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                                  title="Удалить из семьи"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="px-4 pb-4 flex gap-2">
                    {/* Invite */}
                    {isAdmin && availableFriends.length > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setInviteFamilyId(family.id)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Пригласить
                      </Button>
                    )}

                    {/* Leave */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => onLeaveFamily(family.id)}
                    >
                      <LogOut className="w-4 h-4 mr-1" />
                      Выйти
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* No Families */}
          {families.length === 0 && !showCreateForm && (
            <div className="text-center py-8 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Вы не состоите ни в одной семье</p>
              <p className="text-sm">Создайте семью, чтобы добавлять задачи</p>
            </div>
          )}
        </div>

        {/* Invite Modal */}
        {inviteFamilyId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-4 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Пригласить в семью</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setInviteFamilyId(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {getAvailableFriends(inviteFamilyId).map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => {
                      onInviteToFamily(inviteFamilyId, friend.id);
                      setInviteFamilyId(null);
                    }}
                    className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={friend.avatar_url || ''} />
                      <AvatarFallback>{friend.first_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{friend.first_name}</p>
                      <p className="text-sm text-gray-500">@{friend.username}</p>
                    </div>
                    <Plus className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
