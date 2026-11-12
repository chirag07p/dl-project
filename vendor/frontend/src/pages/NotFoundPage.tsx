import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { AlertTriangleIcon, ArrowRightIcon } from '../components/icons';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4 py-16">
      <Card className="w-full text-center">
        <CardHeader className="items-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <AlertTriangleIcon size={28} />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">404 - Page Not Found</CardTitle>
          <CardDescription>
            The requested screen or route does not exist in this project milestone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Currently, Milestone A has initialized the application framework, shared layout, design system, and Landing page. Additional screens (Login, Register, Dashboard, etc.) will be activated in upcoming milestones.
          </p>
        </CardContent>
        <CardFooter className="justify-center border-t-0 pt-2">
          <Link to="/">
            <Button variant="primary" rightIcon={<ArrowRightIcon size={16} />}>
              Return to Project Overview
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
