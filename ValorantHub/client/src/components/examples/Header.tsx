import Header from '../Header';
import { Route, Switch } from 'wouter';

export default function HeaderExample() {
  return (
    <div>
      <Header />
      <Switch>
        <Route path="/" component={() => <div className="p-8">Home Page Content</div>} />
        <Route path="/teams" component={() => <div className="p-8">Teams Page Content</div>} />
        <Route path="/profile" component={() => <div className="p-8">Profile Page Content</div>} />
      </Switch>
    </div>
  );
}
