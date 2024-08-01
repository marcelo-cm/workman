import {
  EnvelopeClosedIcon,
  IdCardIcon,
  LinkedInLogoIcon,
} from '@radix-ui/react-icons';

import Image from 'next/image';

import WorkmanLogo from '@/components/molecules/WorkmanLogo';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center text-center">
      <nav className="sticky top-0 z-50 flex h-16 w-full justify-center border border-b bg-white">
        <div className="flex w-full max-w-[1100px] items-center justify-between px-4 md:p-0">
          <WorkmanLogo className="w-16" />
          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/company/workmanai/">
              <LinkedInLogoIcon className="mx-2 text-wm-orange hover:text-wm-orange-300" />
            </a>
            <Button asChild>
              <a href="mailto:ethan@workman.so" target="_blank">
                <EnvelopeClosedIcon />
                Contact
              </a>
            </Button>
            <Button variant={'secondary'} asChild>
              <a href="/auth/sign-in" target="_self">
                <IdCardIcon /> Sign In
              </a>
            </Button>
          </div>
        </div>
      </nav>
      <div className="flex w-full max-w-[1100px] flex-col items-center gap-8 px-4 py-16 ">
        <div className="flex flex-col items-center gap-8">
          <WorkmanLogo variant="COMBO" className="w-64 lg:w-96" />
          <h1 className="text-2xl">
            Automated data entry from your invoices into your existing
            bookkeeping software
          </h1>
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-wm-white-400">
              Fully Integrated with Gmail and QuickBooks
            </h2>
            <div className="flex gap-4">
              <Image
                src="/icons/gmail.svg"
                alt="Google Mail (Gmail)"
                width={32}
                height={32}
              />
              <Image
                src="/icons/quickbooks.svg"
                alt="QuickBooks Online"
                width={32}
                height={32}
              />
            </div>
          </div>
        </div>
        <Image
          src={'/WorkmanSneakPeek.png'}
          alt="Workman Platform 'For Approval' Dashboard"
          width={1100}
          height={450}
          className="h-auto w-full max-w-[1100px] rounded-md border shadow-md"
        />
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex items-center gap-2 rounded-md border p-2 pr-4 font-medium">
            <Button size={'icon'} className="rounded-full">
              1
            </Button>{' '}
            Upload from Gmail or local files
          </div>
          <div className="flex items-center gap-2 rounded-md border p-2 pr-4 font-medium">
            <Button size={'icon'} className="rounded-full">
              2
            </Button>{' '}
            Review our AI's data extraction
          </div>
          <div className="flex items-center gap-2 rounded-md border p-2 pr-4 font-medium">
            <Button size={'icon'} className="rounded-full">
              3
            </Button>{' '}
            Approve and send to QuickBooks
          </div>
        </div>
        <div className="rounded-md border p-2 md:p-4 ">
          <video
            src="WorkmanDemo.mp4"
            className="w-full max-w-[900px] rounded-sm border"
            autoPlay={true}
            loop={true}
            controls={true}
          />
        </div>
      </div>
      <footer className="flex w-full justify-center gap-8 py-16 text-sm">
        <Button variant={'ghost'}>
          <a href="/privacy-policy">Privacy Policy</a>
        </Button>
        <Button variant={'ghost'}>
          <a href="/terms-of-service">Terms of Service</a>
        </Button>
      </footer>
    </div>
  );
}
