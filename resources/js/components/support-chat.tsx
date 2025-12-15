import { useLocale } from '@/hooks/use-locale';
import { cn } from '@/lib/utils';
import { MessageCircle, Send, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Spinner } from './ui/spinner';

type ChatMessage = {
    role: 'assistant' | 'user';
    content: string;
};

export function SupportChat() {
    const { locale, direction } = useLocale();
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const greeting = useMemo(
        () =>
            locale === 'ar'
                ? 'أهلاً! أنا مساعد الذكاء الاصطناعي لمطعم البرغر البقري. اكتب 1 لعرض المنيو أو 2 لطلب اتصال من الخط الساخن. أخبرني بتقييمك أو أي سؤال آخر.'
                : "Hi! I'm your AI assistant for our beef burger kitchen. Reply 1 for the menu or 2 if you want our hotline team to call you. You can also share a rating or any question.",
        [locale],
    );

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{ role: 'assistant', content: greeting }]);
        }
        // Only seed the greeting once on mount/locale change if empty
    }, [greeting, messages.length]);

    useEffect(() => {
        if (!listRef.current) return;
        listRef.current.scrollTo({
            top: listRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages, open]);

    const sendMessage = async () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const nextMessages: ChatMessage[] = [
            ...messages,
            { role: 'user', content: trimmed },
        ];

        setMessages(nextMessages);
        setInput('');
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/assistant/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    message: trimmed,
                    messages,
                    locale,
                }),
            });

            if (!response.ok) {
                throw new Error('assistant_unavailable');
            }

            const data = await response.json();
            setMessages([
                ...nextMessages,
                {
                    role: 'assistant',
                    content:
                        typeof data.reply === 'string' && data.reply.length > 0
                            ? data.reply
                            : locale === 'ar'
                                ? 'ها أنا هنا لمساعدتك. اكتب 1 للمنيو أو 2 لطلب اتصال.'
                                : "I'm here to help. Type 1 for the menu or 2 to request a call.",
                },
            ]);
        } catch (err) {
            const fallback =
                locale === 'ar'
                    ? 'تعذر التواصل الآن. اكتب رقمك وسيتصل بك فريق الدعم.'
                    : 'I could not reach the assistant right now. Share your phone number and our team will call you.';

            setMessages([
                ...nextMessages,
                {
                    role: 'assistant',
                    content: fallback,
                },
            ]);
            setError(
                locale === 'ar'
                    ? 'حدث خطأ أثناء جلب الرد.'
                    : 'Something went wrong fetching a reply.',
            );
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    const toggleChat = () => {
        setOpen((prev) => !prev);
    };

    return (
        <div
            className={cn(
                'fixed z-50',
                direction === 'rtl' ? 'left-4' : 'right-4',
                'bottom-4',
            )}
        >
            {open && (
                <Card className="mb-3 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden shadow-2xl dark:border-neutral-800">
                    <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-[#00a0a3] to-cyan-600 py-3 text-white">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <MessageCircle className="h-5 w-5" />
                            {locale === 'ar'
                                ? 'مساعد المطعم'
                                : 'Restaurant Assistant'}
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleChat}
                            className="text-white hover:bg-white/10"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3 p-3">
                        <div className="text-xs text-muted-foreground">
                            {locale === 'ar'
                                ? 'أكتب بالعربية أو الإنجليزية. اطلب المنيو، قيّم تجربتك، أو اطلب اتصال من الفريق.'
                                : 'Chat in Arabic or English. Ask for the menu, rate your meal, or request a call back.'}
                        </div>
                        <div
                            ref={listRef}
                            className="max-h-80 space-y-3 overflow-y-auto rounded-lg bg-neutral-50 p-2 dark:bg-neutral-900/60"
                        >
                            {messages.map((message, index) => {
                                const isUser = message.role === 'user';
                                return (
                                    <div
                                        key={`${message.role}-${index}`}
                                        className={cn(
                                            'flex',
                                            isUser
                                                ? direction === 'rtl'
                                                    ? 'justify-start'
                                                    : 'justify-end'
                                                : direction === 'rtl'
                                                    ? 'justify-end'
                                                    : 'justify-start',
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                'max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm',
                                                isUser
                                                    ? 'bg-[#00a0a3] text-white'
                                                    : 'bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100',
                                            )}
                                            dangerouslySetInnerHTML={{
                                                __html: message.content
                                                    .replace(/\n/g, '<br/>'),
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-center gap-2">
                            <Input
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={
                                    locale === 'ar'
                                        ? 'اكتب رسالتك...'
                                        : 'Type your message...'
                                }
                                className="flex-1"
                                disabled={loading}
                            />
                            <Button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                className="bg-gradient-to-r from-[#00a0a3] to-cyan-600 text-white shadow-sm hover:from-[#008789] hover:to-cyan-700"
                                type="button"
                            >
                                {loading ? (
                                    <Spinner className="h-4 w-4" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {error && (
                            <p className="text-xs text-red-500">{error}</p>
                        )}
                    </CardContent>
                </Card>
            )}
            <Button
                onClick={toggleChat}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00a0a3] to-cyan-600 px-4 py-2 text-white shadow-lg hover:from-[#008789] hover:to-cyan-700"
            >
                <MessageCircle className="h-4 w-4" />
                {open
                    ? locale === 'ar'
                        ? 'إغلاق المساعد'
                        : 'Close assistant'
                    : locale === 'ar'
                        ? 'تحدث مع المساعد'
                        : 'Chat with assistant'}
            </Button>
        </div>
    );
}
