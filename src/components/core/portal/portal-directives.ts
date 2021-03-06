import { ComponentRef, Directive, TemplateRef, ComponentResolver, ViewContainerRef } from '@angular/core';
import {Portal, TemplatePortal, ComponentPortal, BasePortalHost} from './portal';


@Directive({
  selector: '[portal]',
  exportAs: 'portal',
})
export class TemplatePortalDirective extends TemplatePortal {
  constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
    super(templateRef, viewContainerRef);
  }
}

@Directive({
  selector: '[portalHost]',
  inputs: ['portal: portalHost']
})
export class PortalHostDirective extends BasePortalHost {
  /** The attached portal. */
  private _portal: Portal<any>;

  constructor(
    private _componentResolver: ComponentResolver,
    private _viewContainerRef: ViewContainerRef) {
    super();
  }

  get portal(): Portal<any> {
    return this._portal;
  }

  set portal(p: Portal<any>) {
    this._replaceAttachedPortal(p);
  }

  /** Attach the given ComponentPortal to this PortalHost using the ComponentResolver. */
  attachComponentPortal<T>(portal: ComponentPortal<T>): Promise<ComponentRef<T>> {
    portal.setAttachedHost(this);

    // If the portal specifies an origin, use that as the logical location of the component
    // in the application tree. Otherwise use the location of this PortalHost.
    let viewContainerRef = portal.viewContainerRef != null ?
      portal.viewContainerRef :
      this._viewContainerRef;

    return this._componentResolver.resolveComponent(portal.component).then(componentFactory => {
      let ref = viewContainerRef.createComponent(
        componentFactory, viewContainerRef.length,
        portal.injector || viewContainerRef.parentInjector);

      this.setDisposeFn(() => ref.destroy());
      return ref;
    });
  }

  /** Attach the given TemplatePortal to this PortalHost as an embedded View. */
  attachTemplatePortal(portal: TemplatePortal): Promise<Map<string, any>> {
    portal.setAttachedHost(this);

    this._viewContainerRef.createEmbeddedView(portal.templateRef);
    this.setDisposeFn(() => this._viewContainerRef.clear());

    // TODO(jelbourn): return locals from view
    return Promise.resolve(new Map<string, any>());
  }

  /** Detaches the currently attached Portal (if there is one) and attaches the given Portal. */
  private _replaceAttachedPortal(p: Portal<any>): void {
    let maybeDetach = this.hasAttached() ? this.detach() : Promise.resolve(null);

    maybeDetach.then(() => {
      if (p) {
        this.attach(p);
        this._portal = p;
      }
    });
  }
}

export const PORTAL_DIRECTIVES = [
  TemplatePortalDirective,
  PortalHostDirective
];